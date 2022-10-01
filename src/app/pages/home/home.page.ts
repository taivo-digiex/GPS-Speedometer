import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { Platform } from '@ionic/angular';
import { UnitService } from '../../services/unit/unit.service';
import { CalculateService } from 'src/app/services/calculate/calculate.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import SwiperCore, { Autoplay, Pagination } from 'swiper';
import { Subject, takeUntil } from 'rxjs';

SwiperCore.use([Autoplay, Pagination]);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePage implements OnInit, OnDestroy {
  public lat: number;
  public lon: number;
  public speedo: number;
  public topSpeed: number;
  public speedUnit: string;
  public lenghtUnit: string;
  public distanceUnit: string;
  public accuracy: number;
  public altitude: string;
  public averageSpeed: string;
  public trip: string;
  public odo: number;
  public totalTime: string;
  public isSwitchTrip = true;
  public isPortrait = this.platform.isPortrait();
  public checkIsPortraitInterval: any;

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private insomnia: Insomnia,
    private platform: Platform,
    private unitService: UnitService,
    private calculateService: CalculateService,
    private timerService: TimerService,
    private geolocationService: GeolocationService
  ) {}

  public ngOnInit() {
    this.platform.ready().then(() => {
      this.insomnia.keepAwake();
      this.getValue();
      this.initial();
    });
  }

  public ngOnDestroy() {
    this.insomnia.allowSleepAgain();
    this.onDestroy$.next();
  }

  public changeUnit() {
    switch (this.unitService.unit) {
      case 'metric':
        this.unitService.saveUnit('imperial');
        break;

      case 'imperial':
        this.unitService.saveUnit('metric');
        break;
    }
  }

  public stopTracking() {
    this.geolocationService.stop();
    this.insomnia.allowSleepAgain();
  }

  public switchTrip() {
    this.isSwitchTrip = !this.isSwitchTrip;
  }

  private initial() {
    this.checkIsPortraitInterval = setInterval(() => {
      this.isPortrait = this.platform.isPortrait();
    }, 250);

    this.unitService.unitSystem
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.geolocationService.convertUnit();
        this.speedUnit = this.unitService.speedUnit;
        this.distanceUnit = this.unitService.distanceUnit;
        this.lenghtUnit = this.unitService.lenghtUnit;
      });

    this.geolocationService.geolocationData
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.geolocationService.convertUnit();
        this.lat = this.geolocationService.lat;
        this.lon = this.geolocationService.lon;
      });

    this.calculateService.speedoEmit
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((speed) => (this.speedo = speed));

    this.calculateService.topSpeedEmit
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((topSpeed) => {
        this.topSpeed = topSpeed;
      });

    this.calculateService.accuracyEmit
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((accuracy) => {
        this.accuracy = accuracy;
      });

    this.calculateService.altitudeEmit
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((altitude) => {
        this.altitude = altitude;
      });

    this.calculateService.tripEmit
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((trip) => {
        this.trip = trip;
      });

    this.calculateService.odoEmit
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((odo) => {
        this.odo = odo;
      });

    this.calculateService.averageSpeedEmit
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((averageSpeed) => {
        this.averageSpeed = averageSpeed;
      });

    // this.calculateService.calculateData
    //   .pipe(takeUntil(this.onDestroy$))
    //   .subscribe(() => {
    // this.speedo = this.calculateService.speedo;
    // this.topSpeed = this.calculateService.topSpeed;
    // this.accuracy = this.calculateService.accuracy;
    //   this.altitude = this.calculateService.altitude;
    //   this.trip = this.calculateService.trip;
    //   this.odo = this.calculateService.odo;
    //   this.averageSpeed = this.calculateService.averageSpeed;
    // });

    this.timerService.totalTimeEmit
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.totalTime = data;
      });
  }

  private getValue() {
    this.lenghtUnit = this.unitService.lenghtUnit;
    this.speedUnit = this.unitService.speedUnit;
    this.distanceUnit = this.unitService.distanceUnit;
    this.speedo = this.calculateService.speedo;
    this.topSpeed = this.calculateService.topSpeed;
    this.accuracy = this.calculateService.accuracy;
    this.altitude = this.calculateService.altitude;
    this.trip = this.calculateService.trip;
    this.odo = this.calculateService.odo;
    this.averageSpeed = this.calculateService.averageSpeed;
    this.lat = this.geolocationService.lat;
    this.lon = this.geolocationService.lon;
    this.totalTime = this.timerService.convertedTotalTime;
  }
}
