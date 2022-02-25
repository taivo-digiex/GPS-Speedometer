import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { Platform } from '@ionic/angular';
import { UnitService } from '../../services/unit/unit.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TopSpeedService } from 'src/app/services/top-speed/top-speed.service';
import { ToastComponent } from 'src/app/common/components/toast/toast.component';
import { CalculateService } from 'src/app/services/calculate/calculate.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public speed: number;
  public lat: number;
  public lon: number;
  public speedo: number;
  public topSpeed: number;
  public speedUnit: string;
  public lenghtUnit: string;
  public distanceUnit: string;
  public accuracy: number;
  public altitude: string;
  public time: string = '00:00:00';
  public avgSpeed: string;
  public distance: string;

  private rawAccuracy: number;
  private rawAltitude: number;
  private totalElapsedTime: number;
  private timerInterval: any;

  public settingsIcon: string = 'settings';

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private geolocation: Geolocation,
    private ngZone: NgZone,
    private insomnia: Insomnia,
    private platform: Platform,
    private unitService: UnitService,
    private topSpeedService: TopSpeedService,
    private toastComponent: ToastComponent,
    private calculateService: CalculateService,
    private timerService: TimerService,
    private geolocationService: GeolocationService
  ) {}

  public ngOnInit() {
    this.platform.ready().then(() => {
      this.insomnia.keepAwake();
      // this.startTracking();
      this.initial();
    });
  }

  private initial() {
    // this.ngZone.run(() => {
    setInterval(() => {
      this.time = this.timerService.time;
      this.speed = this.geolocationService.speed;
      this.lat = this.geolocationService.lat;
      this.lon = this.geolocationService.lon;
      this.rawAccuracy = this.geolocationService.rawAccuracy;
      this.rawAltitude = this.geolocationService.rawAltitude;
      // if (
      //   this.geolocationService.speed != null &&
      //   this.timerService.totalElapsedTime != null
      // ) {
      //   this.getValue();
      // }

      // this.saveTopSpeed();

      this.topSpeed = this.topSpeedService.topSpeed;
      this.convertUnit();
      // });
    }, 500);
  }

  // private startTracking() {
  //   this.geolocation
  //     .watchPosition({ enableHighAccuracy: true })
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((res) => {
  //       if ('coords' in res) {
  //         this.prepareTracking(res);
  //       } else if ('code' in res) {
  //         const msg = res.message;
  //         this.toastComponent.presentToast('TOAST.err', msg, 1000);
  //       }
  //     });
  //   this.timerService.calculateTime();
  // }

  // private prepareTracking(res: any) {
  //   this.ngZone.run(() => {
  //     this.speed = res.coords.speed;
  //     this.lat = res.coords.latitude;
  //     this.lon = res.coords.longitude;
  //     this.rawAccuracy = res.coords.accuracy;
  //     this.rawAltitude = res.coords.altitude;

  //     if (this.speed != null && this.timerService.totalElapsedTime != null) {
  //       this.getValue();
  //     }

  //     this.saveTopSpeed();
  //     this.convertUnit();
  //   });
  // }

  // private getValue() {
  //   this.geolocationService.getSpeedAndTime();
  //   console.log(this.timerService.totalElapsedTime);
  //   clearInterval(this.timerService.timerInterval);
  //   this.timerService.calculateTime();
  // }

  // DO NOT TOUCH THIS 2 FUNCTIONS
  public changeUnit() {
    if (this.unitService.unit == 'imperial') {
      this.unitService.saveUnit('metric');
    } else if (this.unitService.unit == 'metric') {
      this.unitService.saveUnit('imperial');
    }

    this.toastComponent.presentToast(
      'TOAST.unitChange.' + this.unitService.unit,
      null,
      500
    );

    this.convertUnit();
  }

  private convertUnit() {
    this.unitService.convertUnit();
    this.calculateService.convert(
      this.speed,
      this.rawAccuracy,
      this.rawAltitude
    );

    this.speedo = this.calculateService.speedo;
    this.topSpeed = this.calculateService.topSpeed;
    this.accuracy = this.calculateService.accuracy;
    this.altitude = this.calculateService.altitude;

    if (
      this.geolocationService.speed != null &&
      this.timerService.totalElapsedTime != null
    ) {
      this.distance = this.calculateService.distance;
      this.avgSpeed = this.calculateService.avgSpeed;
    } else {
      this.distance = '-.-';
      this.avgSpeed = '-.-';
    }

    this.lenghtUnit = this.unitService.lenghtUnit;
    this.speedUnit = this.unitService.speedUnit;
    this.distanceUnit = this.unitService.distanceUnit;
  }
  // ----------------------------------------------------------------

  // private saveTopSpeed() {
  //   this.topSpeedService.saveTopSpeed(this.geolocationService.speed);
  //   this.topSpeed = this.topSpeedService.topSpeed;
  // }

  // private calculateTime() {
  //   let startTime: number;
  //   let elapsedTime: number = 0;
  //   startTime = Date.now() - elapsedTime;

  //   this.timerInterval = setInterval(() => {
  //     elapsedTime = Date.now() - startTime;

  //     let diffInHrs = elapsedTime / 3600000;
  //     let hh = Math.floor(diffInHrs);

  //     let diffInMin = (diffInHrs - hh) * 60;
  //     let mm = Math.floor(diffInMin);

  //     let diffInSec = (diffInMin - mm) * 60;
  //     let ss = Math.floor(diffInSec);

  //     this.totalElapsedTime = hh * 3600000 + mm * 60 + ss;
  //   }, 1000);
  // }

  public stop() {
    this.geolocationService.stop();
    this.insomnia.allowSleepAgain();
  }

  public ngOnDestroy() {
    this.insomnia.allowSleepAgain();
  }
}
