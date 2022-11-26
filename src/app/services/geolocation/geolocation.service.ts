import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ToastComponent } from 'src/app/common/components/toast/toast.component';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { TopSpeedService } from '../top-speed/top-speed.service';
import { Storage } from '@ionic/storage-angular';
import { TimerService } from '../timer/timer.service';

const ENABLE_HIGH_ACCURACY = 'enableHighAccuracy';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  @Output() geolocationData = new EventEmitter();

  private onDestroy$: Subject<void> = new Subject<void>();

  private geoLocationDetailArr: any[] = [];

  public enableHighAccuracy: boolean;

  public speed: number;
  public rawAccuracy: number;
  public rawAltitude: number;
  public lat: number;
  public lon: number;
  private lastTimestamp: number;

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
        console.log(res);

        if ('coords' in res) {
          this.prepareTracking(res);
        } else if ('code' in res) {
          this.geolocationData.emit({
            speed: null,
            rawAccuracy: null,
            rawAltitude: null,
            lat: null,
            lon: null,
            time: null,
          });

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
    this.speed = res.coords.speed ? res.coords.speed : this.calculateSpeed(res);
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

  // * Calculate speed based on lat and lon
  private calculateSpeed(geolocationDetail: any) {
    if (geolocationDetail.coords.accuracy > 100) {
      return null;
    }
    this.geoLocationDetailArr.push(geolocationDetail);

    if (this.geoLocationDetailArr.length === 3) {
      this.geoLocationDetailArr.shift();
    }

    if (this.geoLocationDetailArr.length > 1) {
      const p1 =
        this.geoLocationDetailArr[this.geoLocationDetailArr.length - 2];
      const p2 =
        this.geoLocationDetailArr[this.geoLocationDetailArr.length - 1];
      const distance = this.distanceBetween(p2.coords, p1.coords); // meters
      const time = (p2.timestamp - p1.timestamp) / 1000; // seconds

      if (time > 0) {
        return distance / time;
      }
    }
  }

  private distanceBetween(point1: any, point2: any) {
    const earthRadius = 6371000; // * Earth radius (meters) refer from NASA
    // * Since our points should be close to one another, we use the cheaper Pythagoras’ theorem on an equirectangular projection.
    const lat1 = this.toRadians(point1.latitude);
    const lat2 = this.toRadians(point2.latitude);
    const lon1 = this.toRadians(point1.longitude);
    const lon2 = this.toRadians(point2.longitude);
    const x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    const y = lat2 - lat1;
    return Math.sqrt(x * x + y * y) * earthRadius;
  }

  private toRadians(degrees: number) {
    return (degrees * 3.14159265359) / 180;
  }
}
