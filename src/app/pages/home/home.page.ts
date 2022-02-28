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
    setInterval(() => {
      this.time = this.timerService.time;
      this.speed = this.geolocationService.speed;
      this.lat = this.geolocationService.lat;
      this.lon = this.geolocationService.lon;
      this.rawAccuracy = this.geolocationService.rawAccuracy;
      this.rawAltitude = this.geolocationService.rawAltitude;

      this.topSpeed = this.topSpeedService.topSpeed;
      this.convertUnit();
    }, 500);
  }

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

  public stop() {
    this.geolocationService.stop();
    this.insomnia.allowSleepAgain();
  }

  public ngOnDestroy() {
    this.insomnia.allowSleepAgain();
  }
}
