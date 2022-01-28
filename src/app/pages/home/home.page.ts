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
  public accuracyUnit: string;
  public altitude: string;
  public altitudeUnit: string;
  public trip: string;
  public tripUnit: string;

  private unit: string;
  private rawAccuracy: number;
  private rawAltitude: number;

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
  }

  private prepareTracking(res: any) {
    this.ngZone.run(() => {
      this.speed = res.coords.speed;
      this.lat = res.coords.latitude;
      this.long = res.coords.longitude;
      this.rawAccuracy = res.coords.accuracy;
      this.rawAltitude = res.coords.altitude;
      this.getMaxSpeed();
      this.convertUnit();
    });
  }

  private convertUnit() {
    this.unit = this.unitService.unit;
    if (this.unit == 'metric') {
      this.speedo = Math.round(this.speed * 3.6);
      this.maxSpeed = Math.round(this.maxSpeedService.maxSpeed * 3.6);
      this.accuracy = Math.round(this.rawAccuracy);
      this.altitude = this.rawAltitude.toFixed(1);
      this.trip = '0.0';

      this.speedUnit = 'km/h';
      this.accuracyUnit = this.altitudeUnit = 'm';
      this.tripUnit = 'km';
    } else if (this.unit == 'imperial') {
      this.speedo = Math.round(this.speed * 2.23693629);
      this.maxSpeed = Math.round(this.maxSpeedService.maxSpeed * 2.23693629);
      this.accuracy = Math.round(this.rawAccuracy * 3.2808399);
      this.altitude = (this.rawAltitude * 3.2808399).toFixed(1);
      this.trip = '0.0';

      this.speedUnit = 'mph';
      this.accuracyUnit = this.altitudeUnit = 'ft';
      this.tripUnit = 'mi';
    }
  }

  public changeUnit() {
    if (this.unit == 'imperial') {
      this.unit = 'metric';
    } else if (this.unit == 'metric') {
      this.unit = 'imperial';
    }
    this.toastComponent.presentToast(
      'TOAST.unitChange.' + this.unit,
      null,
      500
    );
    this.unitService.setUnit(this.unit);
    this.convertUnit();
  }

  private getMaxSpeed() {
    this.maxSpeed = this.maxSpeedService.maxSpeed;
    const maxSpeedArr = [];
    maxSpeedArr.push(this.speed);
    const currMaxSpeed = Math.max(this.maxSpeed, ...maxSpeedArr);
    this.maxSpeedService.saveMaxSpeed(currMaxSpeed);
  }

  public ngOnDestroy() {
    this.onDestroy$.next();
    this.insomnia.allowSleepAgain();
  }
}
