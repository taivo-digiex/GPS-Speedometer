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
import AppUtil from 'src/app/utilities/app-util';
import AppConstant from 'src/app/utilities/app-constant';
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
  public selectedLanguage: string;
  public selectedUnit: string;
  public appVersion: string;
  public isCheckingForUpdate: boolean;
  public showAdjustSpeedRange: boolean = false;
  public adjustSpeed: RangeValue = 0;
  public enableHighAccuracy: boolean;

  public langIcon = 'language';
  public unitIcon = 'speedometer';
  public trashIcon = 'trash';
  public downloadIcon = 'download';
  public highAccuracyIcon = 'locate';

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
    this.languages = AppUtil.getLanguages(AppConstant);
    this.units = AppUtil.getUnitSystem(AppConstant);
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
            label: 'common.avg_speed',
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
    this.updateService.checkForUpdate(true).then(() => {
      this.isCheckingForUpdate = false;
    });
  }

  public changeUnit(ev: any) {
    this.unitService.saveUnit(ev.target.value);
  }

  public async clearData(value: string[]) {
    try {
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
        this.odoTripService.clearAvgSpeedTrip();
        this.timerService.resetAvgSpeedTotalTime();
      }
    } catch (e) {
      this.toastComponent.presentToast(
        'toast.clear_failed: ' + e,
        null,
        1000,
        'danger'
      );
    } finally {
      this.toastComponent.presentToast(
        'toast.clear_success',
        null,
        1000,
        'success'
      );
    }
  }

  public onAdjustSpeedChange(ev: any) {
    this.calculateService.setAdjustSpeed(ev.detail.value);
  }

  public changeEnableHighAccuracy(ev: any) {
    this.geolocationService.setEnableHighAccuracy(ev.detail.checked.toString());
  }
}
