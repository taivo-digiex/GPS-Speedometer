import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ToastComponent } from 'src/app/common/components/toast/toast.component';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { TopSpeedService } from '../top-speed/top-speed.service';
import { CalculateService } from '../calculate/calculate.service';
import { Storage } from '@ionic/storage-angular';
import { TimerService } from '../timer/timer.service';

const ENABLE_HIGH_ACCURACY = 'enableHighAccuracy';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  @Output() geolocationData = new EventEmitter();

  public speed: number;
  public rawAccuracy: number;
  public rawAltitude: number;
  public lat: number;
  public lon: number;
  public enableHighAccuracy: boolean;

  private lastTimestamp: number;
  private geoLocationDetailArr: any[] = [];

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private geolocation: Geolocation,
    private toastComponent: ToastComponent,
    private topSpeedService: TopSpeedService,
    private timerService: TimerService,
    private storage: Storage
  ) {}

  public startGeolocation() {
    this.geolocation
      .watchPosition({ enableHighAccuracy: this.enableHighAccuracy })
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => {
        if ('coords' in res) {
          this.prepareTracking(res);
        } else if ('code' in res) {
          this.toastComponent.presentToast(
            'toast.error.code.' + res.code,
            null,
            1000,
            'danger'
          );
        }
      });
  }

  public getSpeedAndTime(time: number) {
    this.timerService.saveTotalTime(Math.floor(time));
    this.timerService.saveAverageSpeedTotalTime(Math.floor(time));
  }

  public stop() {
    this.onDestroy$.next();
  }

  public async getEnableHighAccuracy() {
    await this.storage
      .get(ENABLE_HIGH_ACCURACY)
      .then((val) => {
        if (val) {
          this.enableHighAccuracy = val === 'true';
          this.startGeolocation();
        } else {
          this.enableHighAccuracy = true;
          this.setEnableHighAccuracy(true);
        }
      })
      .then(() => {})
      .catch(() => {});
  }

  public async setEnableHighAccuracy(enable: boolean) {
    await this.storage.set(ENABLE_HIGH_ACCURACY, enable.toString()).then(() => {
      this.stop();
      this.enableHighAccuracy = enable.toString() === 'true';
      this.startGeolocation();
    });
  }

  private prepareTracking(res: any) {
    if (!res.coords.speed) {
      this.speed = this.calculateSpeed(res);
    } else {
      this.speed = res.coords.speed;
    }
    this.rawAccuracy = res.coords.accuracy;
    this.rawAltitude = res.coords.altitude;
    this.lat = res.coords.latitude;
    this.lon = res.coords.longitude;

    let time: number;
    if (this.lastTimestamp && this.speed) {
      time = (res.timestamp - this.lastTimestamp) / 1000;
    } else {
      this.lastTimestamp = res.timestamp;
      time = (res.timestamp - this.lastTimestamp) / 1000;
    }
    this.lastTimestamp = res.timestamp;

    this.getSpeedAndTime(time);
    this.topSpeedService.saveTopSpeed(this.speed);

    this.geolocationData.emit({
      speed: this.speed,
      rawAccuracy: this.rawAccuracy,
      rawAltitude: this.rawAltitude,
      lat: this.lat,
      lon: this.lon,
      time: time,
    });
  }

  // *Calculate speed based on lat and lon
  private calculateSpeed(geoLocationDetail: any) {
    this.geoLocationDetailArr.push(geoLocationDetail);

    if (this.geoLocationDetailArr.length == 3) {
      this.geoLocationDetailArr.shift();
    }

    if (this.geoLocationDetailArr.length > 1) {
      var p1 = this.geoLocationDetailArr[this.geoLocationDetailArr.length - 2];
      var p2 = this.geoLocationDetailArr[this.geoLocationDetailArr.length - 1];
      var distance = this.distanceBetween(p2.coords, p1.coords); // meters
      var time = (p2.timestamp - p1.timestamp) / 1000 / 60; // seconds

      if (time > 0) {
        return distance / time;
      }
    }
  }

  private distanceBetween(point1: any, point2: any) {
    const earthRadius = 6378000; // meters
    // Since our points should be close to one another, we use the cheaper
    // Pythagoras’ theorem on an equirectangular projection.
    var lat1 = this.toRadians(point1.latitude);
    var lat2 = this.toRadians(point2.latitude);
    var lon1 = this.toRadians(point1.longitude);
    var lon2 = this.toRadians(point2.longitude);
    var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    var y = lat2 - lat1;
    return Math.sqrt(x * x + y * y) * earthRadius;
  }

  private toRadians(degrees: number) {
    return (degrees * 3.1415926) / 180;
  }
}
