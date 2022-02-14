import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { Platform } from '@ionic/angular';
import { UnitService } from '../../services/unit/unit.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MaxSpeedService } from 'src/app/services/max-speed/max-speed.service';
import { ToastComponent } from 'src/app/common/components/toast/toast.component';

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
  public maxSpeed: number;
  public speedUnit: string;
  public accuracy: number;
  public altitude: string;
  public lenghtUnit: string;
  public time: string = '00:00:00';
  public avgspeed: string;

  private rawAccuracy: number;
  private rawAltitude: number;
  private totalElapsedTime: number;
  private timestamp: number;
  private oldTimestamp: number;
  private oldspeed: number;

  public settingsIcon: string = 'settings';

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private geolocation: Geolocation,
    private ngZone: NgZone,
    private insomnia: Insomnia,
    private platform: Platform,
    private unitService: UnitService,
    private maxSpeedService: MaxSpeedService,
    private toastComponent: ToastComponent
  ) {}

  public ngOnInit() {
    this.platform.ready().then(() => {
      this.insomnia.keepAwake();
      this.startTracking();
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

    this.startTimer();
  }

  private prepareTracking(res: any) {
    this.ngZone.run(() => {
      this.oldspeed = this.speed;
      this.speed = res.coords.speed;
      this.lat = res.coords.latitude;
      this.long = res.coords.longitude;
      this.rawAccuracy = res.coords.accuracy;
      this.rawAltitude = res.coords.altitude;
      this.timestamp = this.totalElapsedTime;

      this.getMaxSpeed();
      this.convertUnit();
    });
  }

  private convertUnit() {
    this.unitService.convertUnit(
      this.speed,
      this.rawAccuracy,
      this.rawAltitude
    );

    this.speedo = this.unitService.speedo;
    this.maxSpeed = this.unitService.maxSpeed;
    this.accuracy = this.unitService.accuracy;
    this.altitude = this.unitService.altitude;

    this.lenghtUnit = this.unitService.lenghtUnit;
    this.speedUnit = this.unitService.speedUnit;
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

  private getMaxSpeed() {
    this.maxSpeedService.saveMaxSpeed(this.speed);
    this.maxSpeed = this.maxSpeedService.maxSpeed;
  }

  private startTimer() {
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

      this.totalElapsedTime = hh * 3600000 + mm * 60 + ss;

      //check this shit
      this.avgspeed = (
        ((this.oldspeed * this.timestamp + this.speed * this.totalElapsedTime) /
          (this.totalElapsedTime + this.timestamp)) *
        3.6
      ).toFixed(1);
    }, 1000);
  }

  public ngOnDestroy() {
    this.onDestroy$.next();
    this.insomnia.allowSleepAgain();
  }
}
