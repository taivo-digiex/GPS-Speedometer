import { EventEmitter, Injectable, Output } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { TopSpeedService } from '../top-speed/top-speed.service';
import { Storage } from '@ionic/storage-angular';
import { TimerService } from '../timer/timer.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { AlertComponent } from './../../common/components/alert/alert.component';
import {
  AndroidSettings,
  IOSSettings,
  NativeSettings,
} from 'capacitor-native-settings';

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
    private alertComponent: AlertComponent,
    private topSpeedService: TopSpeedService,
    private timerService: TimerService,
    private storage: Storage,
    private platform: Platform
  ) {}

  public startGeolocation() {
    SplashScreen.hide().then(() => {
      this.geolocation
        .watchPosition({ enableHighAccuracy: this.enableHighAccuracy })
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((res) => {
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

            this.alertComponent.alertWithButtons(
              'alert.header.warning',
              null,
              `toast.error.code.${res.code}`,
              null,
              'button.dismiss',
              'common.setting',
              null,
              this,
              () => this.openSetting()
            );
          }
        });
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
    if (geolocationDetail.coords.accuracy > 500) {
      return;
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

  private async openSetting() {
    if (this.platform.is('ios')) {
      await NativeSettings.openIOS({
        option: IOSSettings.LocationServices,
      });
    } else {
      await NativeSettings.openAndroid({
        option: AndroidSettings.Location,
      });
    }
  }
}
