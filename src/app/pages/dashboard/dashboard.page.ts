import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { Platform } from '@ionic/angular';
import { UnitService } from '../../services/unit/unit.service';
import { CalculateService } from 'src/app/services/calculate/calculate.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import SwiperCore, { Autoplay, Pagination, EffectCoverflow } from 'swiper';
import { Subject, takeUntil } from 'rxjs';

SwiperCore.use([Autoplay, Pagination, EffectCoverflow]);

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardPage implements OnInit, OnDestroy {
  public isSwitchTrip: boolean = true;
  public isPortrait: boolean = this.platform.isPortrait();

  private onDestroy$: Subject<void> = new Subject<void>();

  public checkIsPortraitInterval: any;

  public lat: number;
  public lon: number;
  public speedo: number;
  public accuracy: number;
  public odo: number;
  public topSpeed: number;

  public speedUnit: string;
  public lengthUnit: string;
  public distanceUnit: string;
  public altitude: string;
  public averageSpeed: string;
  public trip: string;
  public totalTime: string;
  public gpsStrengthSignalColor: string;

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
      .subscribe((res) => {
        this.speedUnit = res.speedUnit;
        this.distanceUnit = res.distanceUnit;
        this.lengthUnit = res.lengthUnit;
      });

    this.geolocationService.geolocationData
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => {
        this.lat = res.lat;
        this.lon = res.lon;
        this.updateGPSAccuracy(res.rawAccuracy);
      });

    this.calculateService.calculateData
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => {
        this.speedo = res.speedo;
        this.topSpeed = res.topSpeed;
        this.accuracy = res.accuracy;
        this.altitude = res.altitude;
        this.trip = res.trip;
        this.odo = res.odo;
        this.averageSpeed = res.averageSpeed;
      });

    this.timerService.totalTimeEmit
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.totalTime = data;
      });
  }

  private getValue() {
    this.lengthUnit = this.unitService.lengthUnit;
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

    this.updateGPSAccuracy(this.geolocationService.rawAccuracy);
  }

  private updateGPSAccuracy(rawAccuracy: number) {
    if (!rawAccuracy) {
      document
        .getElementById('gpsStrengthSignal')
        .classList.remove('error-blink');
      document
        .getElementById('gpsStrengthSignal')
        .classList.add('standby-blink');
      this.gpsStrengthSignalColor = '';
    } else if (rawAccuracy) {
      document
        .getElementById('gpsStrengthSignal')
        .classList.remove('standby-blink');

      if (rawAccuracy <= 6) {
        document
          .getElementById('gpsStrengthSignal')
          .classList.remove('error-blink');
        this.gpsStrengthSignalColor = 'success';
      } else if (rawAccuracy <= 25) {
        document
          .getElementById('gpsStrengthSignal')
          .classList.remove('error-blink');
        this.gpsStrengthSignalColor = 'warning';
      } else {
        document
          .getElementById('gpsStrengthSignal')
          .classList.add('error-blink');
        this.gpsStrengthSignalColor = 'danger';
      }
    }
  }
}
