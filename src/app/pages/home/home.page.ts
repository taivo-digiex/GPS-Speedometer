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

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public speed: number;
  public lat: number;
  public long: number;
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
    private calculateService: CalculateService
  ) {}

  public ngOnInit() {
    this.platform.ready().then(() => {
      this.insomnia.keepAwake();
      this.startTracking();
      this.timer();
    });
  }

  private startTracking() {
    this.geolocation
      .watchPosition({ enableHighAccuracy: true })
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => {
        if ('coords' in res) {
          this.prepareTracking(res);
        } else if ('code' in res) {
          const msg = res.message;
          this.toastComponent.presentToast('TOAST.err', msg, 1000);
        }
      });
    this.calculateTime();
  }

  private prepareTracking(res: any) {
    this.ngZone.run(() => {
      this.speed = res.coords.speed;
      this.lat = res.coords.latitude;
      this.long = res.coords.longitude;
      this.rawAccuracy = res.coords.accuracy;
      this.rawAltitude = res.coords.altitude;

      if (this.speed != null && this.totalElapsedTime != null) {
        this.getValue();
      }

      this.getTopSpeed();
      this.convertUnit();
    });
  }

  private getValue() {
    this.calculateService.getValue(this.speed, this.totalElapsedTime);
    clearInterval(this.timerInterval);
    this.calculateTime();
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

    if (this.speed != null && this.totalElapsedTime != null) {
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

  private getTopSpeed() {
    this.topSpeedService.saveTopSpeed(this.speed);
    this.topSpeed = this.topSpeedService.topSpeed;
  }

  private calculateTime() {
    let startTime: number;
    let elapsedTime: number = 0;
    startTime = Date.now() - elapsedTime;

    this.timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;

      let diffInHrs = elapsedTime / 3600000;
      let hh = Math.floor(diffInHrs);

      let diffInMin = (diffInHrs - hh) * 60;
      let mm = Math.floor(diffInMin);

      let diffInSec = (diffInMin - mm) * 60;
      let ss = Math.floor(diffInSec);

      this.totalElapsedTime = hh * 3600000 + mm * 60 + ss;
    }, 1000);
  }

  public timer() {
    let startTime: number;
    let elapsedTime: number = 0;
    startTime = Date.now() - elapsedTime;

    setInterval(() => {
      elapsedTime = Date.now() - startTime;

      let diffInHrs = elapsedTime / 3600000;
      let hh = Math.floor(diffInHrs);

      let diffInMin = (diffInHrs - hh) * 60;
      let mm = Math.floor(diffInMin);

      let diffInSec = (diffInMin - mm) * 60;
      let ss = Math.floor(diffInSec);

      let formattedHH = hh.toString().padStart(2, '0');
      let formattedMM = mm.toString().padStart(2, '0');
      let formattedSS = ss.toString().padStart(2, '0');

      this.time = `${formattedHH}:${formattedMM}:${formattedSS}`;
    }, 1000);
  }

  public stop() {
    this.onDestroy$.next();
    this.insomnia.allowSleepAgain();
  }

  public ngOnDestroy() {
    this.insomnia.allowSleepAgain();
  }
}
