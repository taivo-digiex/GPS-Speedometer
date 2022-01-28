import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { UnitService } from '../../services/unit/unit.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MaxSpeedService } from 'src/app/services/max-speed/max-speed.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';

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
  public refreshIcon: string = 'refresh';

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private geolocation: Geolocation,
    private ngZone: NgZone,
    private insomnia: Insomnia,
    private toastController: ToastController,
    private platform: Platform,
    private unitService: UnitService,
    private maxSpeedService: MaxSpeedService,
    private translateService: TranslateService,
    private alertController: AlertController
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
          this.presentToast('TOAST.err', msg, 1000);
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
    this.presentToast('TOAST.unitChange.' + this.unit, null, 500);
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

  public resetTrip() {
    this.presentAlertConfirm(
      'Test feature',
      'This feature is not available right now',
      null,
      null
    );
  }

  private async presentToast(msg: any, value: any, time: number) {
    const toast = await this.toastController.create({
      message: this.translateService.instant(msg, { value: value }),
      duration: time,
    });
    await toast.present();
  }

  public ngOnDestroy() {
    this.onDestroy$.next();
    this.insomnia.allowSleepAgain();
  }

  private async presentAlertConfirm(
    header: any,
    msg: any,
    cancelFunc: any,
    okFunc: any
  ) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: () => {
            cancelFunc;
          },
        },
        {
          text: 'Confirm',
          id: 'confirm-button',
          handler: () => {
            okFunc;
          },
        },
      ],
    });

    await alert.present();
  }
}
