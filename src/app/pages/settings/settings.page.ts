import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LanguageService } from 'src/app/services/language/language.service';
import { TopSpeedService } from 'src/app/services/top-speed/top-speed.service';
import { ToastComponent } from 'src/app/common/components/toast/toast.component';
import { UpdateService } from 'src/app/services/update/update.service';
import { AlertComponent } from 'src/app/common/components/alert/alert.component';
import { UnitService } from 'src/app/services/unit/unit.service';
import { OdoTripService } from 'src/app/services/odo-trip/odo-trip.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import { RangeValue } from '@ionic/core';
import { CalculateService } from 'src/app/services/calculate/calculate.service';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public languages: any[] = [];
  public units: any[] = [];

  public isCheckingForUpdate: boolean;
  public enableHighAccuracy: boolean =
    this.geolocationService.enableHighAccuracy;

  public selectedLanguage: string;
  public selectedUnit: string;
  public appVersion: string = this.updateService.versionNumber;

  public speedCorrection: RangeValue =
    this.calculateService.speedCorrection | 0;

  constructor(
    private location: Location,
    private languageService: LanguageService,
    private topSpeedService: TopSpeedService,
    private toastComponent: ToastComponent,
    private updateService: UpdateService,
    private alertComponent: AlertComponent,
    private unitService: UnitService,
    private odoTripService: OdoTripService,
    private timerService: TimerService,
    private calculateService: CalculateService,
    private geolocationService: GeolocationService
  ) {}

  public ngOnInit() {
    this.getLangSelected();
    this.getUnitSelected();
  }

  public async confirmClear() {
    await this.alertComponent
      .alertWithInput(
        {
          header: 'alert.header.h1',
          message: 'alert.msg.m1',
          buttons: [
            {
              text: 'button.cancel',
              role: 'cancel',
            },
            {
              text: 'button.confirm',
              handler: (value) => {
                this.clearData(value);
              },
            },
          ],
        },
        [
          {
            type: 'checkbox',
            label: 'common.top_speed',
            value: 'topSpeed',
            handler: (value) => {
              this.isCheckBoxChecked(value.checked);
            },
          },
          {
            type: 'checkbox',
            label: 'common.trip_meter',
            value: 'tripMeter',
            handler: (value) => {
              this.isCheckBoxChecked(value.checked);
            },
          },
          {
            type: 'checkbox',
            label: 'common.travel_time',
            value: 'travelTime',
            handler: (value) => {
              this.isCheckBoxChecked(value.checked);
            },
          },
          {
            type: 'checkbox',
            label: 'common.average_speed',
            value: 'avgSpeed',
            handler: (value) => {
              this.isCheckBoxChecked(value.checked);
            },
          },
        ]
      )
      .then(() => {
        this.isCheckBoxChecked(false);
      });
  }

  private isCheckBoxChecked(value: boolean) {
    //TODO create array object contain all checkboxes

    if (value) {
      document
        .querySelector('ion-alert div.alert-button-group button:nth-of-type(2)')
        .removeAttribute('disabled');
    } else {
      document
        .querySelector('ion-alert div.alert-button-group button:nth-of-type(2)')
        .setAttribute('disabled', 'true');
    }
  }

  public selectLng(ev: any) {
    this.languageService.setLanguage(ev.target.value);
  }

  public back() {
    this.location.back();
  }

  public checkForUpdate() {
    this.isCheckingForUpdate = true;
    this.updateService
      .checkForUpdate(true)
      .then(() => (this.isCheckingForUpdate = false));
  }

  public changeUnit(ev: any) {
    this.unitService.saveUnit(ev.target.value);
  }

  public onSpeedCorrectionChange(ev: any) {
    this.calculateService
      .setSpeedCorrection(ev.detail.value)
      .then(
        () => (this.speedCorrection = this.calculateService.speedCorrection)
      );
  }

  public changeEnableHighAccuracy() {
    this.geolocationService
      .setEnableHighAccuracy(!this.enableHighAccuracy)
      .then(
        () =>
          (this.enableHighAccuracy = this.geolocationService.enableHighAccuracy)
      );
  }

  private getLangSelected() {
    this.languages = this.languageService.getLanguages();
    this.selectedLanguage = this.languageService.selected;
  }

  private getUnitSelected() {
    this.units = this.unitService.getUnits();
    this.selectedUnit = this.unitService.unit;
  }

  public async clearData(value: string[]) {
    try {
      this.geolocationService.stop();

      if (value.includes('topSpeed')) {
        this.topSpeedService.clearTopSpeed();
      }

      if (value.includes('travelTime')) {
        this.timerService.resetTotalTime();
      }

      if (value.includes('tripMeter')) {
        this.odoTripService.clearTrip();
      }

      if (value.includes('avgSpeed')) {
        this.odoTripService.clearAverageSpeedTrip();
        this.timerService.resetAverageSpeedTotalTime();
      }
    } catch (e) {
      this.geolocationService.startGeolocation();
      this.toastComponent.presentToast(
        'toast.clear_failed: ' + e,
        null,
        1000,
        'danger'
      );
    } finally {
      this.geolocationService.startGeolocation();
      this.toastComponent.presentToast(
        'toast.clear_success',
        null,
        1000,
        'success'
      );
    }
  }

  public clickElement(elementId: string) {
    document.getElementById(elementId).click();
  }
}
