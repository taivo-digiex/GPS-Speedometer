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
import AppConstant from 'src/app/utilities/app-constant';
import AppUtil from 'src/app/utilities/app-util';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public languages: any[] = AppUtil.getLanguages(AppConstant);
  public units: any[] = AppUtil.getUnitSystem(AppConstant);

  public isCheckingForUpdate: boolean;
  public enableHighAccuracy: boolean =
    this.geolocationService.enableHighAccuracy;

  public selectedLanguage: string;
  public selectedUnit: string;
  public appVersion: string = this.updateService.versionNumber;

  public speedCorrection: RangeValue =
    this.calculateService.speedCorrection | 0;

  public isOpenAccountModal: boolean = false;
  public isLogUp: boolean = false;
  // public authUser: any;

  public logUpForm: FormGroup = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
    confirmPassword: new FormControl(),
  });

  public logInForm: FormGroup = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });

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
    private geolocationService: GeolocationService,
    public authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private storage: Storage
  ) {}

  public ngOnInit() {
    this.getLangSelected();
    this.getUnitSelected();
    this.initForm();
  }

  public getAuthUser() {
    return this.authenticationService.userData;
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
            label: 'common.topSpeed',
            value: 'topSpeed',
            handler: (value) => {
              this.isCheckBoxChecked(value.checked);
            },
          },
          {
            type: 'checkbox',
            label: 'common.tripMeter',
            value: 'tripMeter',
            handler: (value) => {
              this.isCheckBoxChecked(value.checked);
            },
          },
          {
            type: 'checkbox',
            label: 'common.travelTime',
            value: 'travelTime',
            handler: (value) => {
              this.isCheckBoxChecked(value.checked);
            },
          },
          {
            type: 'checkbox',
            label: 'common.averageSpeed',
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
    this.getLangSelected();
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
    this.getUnitSelected();
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
    // this.languages = this.languageService.getLanguages();
    this.selectedLanguage = this.languageService.selected;
  }

  private getUnitSelected() {
    // this.units = this.unitService.getUnits();
    this.selectedUnit = this.unitService.unit;
  }

  private initForm() {
    this.logInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.logUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
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
        'toast.clearSuccess',
        null,
        1000,
        'success'
      );
    }
  }

  public clickElement(elementId: string) {
    document.getElementById(elementId).click();
  }

  public openModal() {
    this.isOpenAccountModal = true;
  }

  public closeModal() {
    if (this.isLogUp) {
      this.logUpForm.reset();
    } else {
      this.logInForm.reset();
    }
    this.isLogUp = false;
    this.isOpenAccountModal = false;
  }

  public onLogIn() {
    if (this.logInForm.invalid || this.logInForm.disabled) {
      return;
    }

    this.logInForm.disable();

    this.authenticationService
      .LogIn(this.logInForm.value.email, this.logInForm.value.password)
      .then((res) => {
        this.logInForm.enable();
      });
  }

  public onLogUp() {
    if (
      this.logUpForm.invalid ||
      this.logUpForm.disabled ||
      this.logUpForm.value.password !== this.logUpForm.value.confirmPassword
    ) {
      return;
    }

    this.logUpForm.disable();

    this.authenticationService
      .LogUp(this.logUpForm.value.email, this.logUpForm.value.password)
      .then((res) => {
        this.logUpForm.enable();
        if (res) {
          this.isLogUp = false;
        }
      });
  }

  public logOut() {
    this.authenticationService.LogOut();
  }

  public async backUpData() {
    this.toastComponent.presentToast('backing up...', null, 60000);
    let params = {};
    for (const [value] of Object.entries(AppConstant.backUpKeys)) {
      await this.storage.get(value).then(async (data) => {
        params = { ...params, [value]: data };
      });
    }

    this.firebaseService
      .setData(
        '/dashboard_information',
        this.authenticationService.userData.uid,
        params
      )
      .then((res: any) => {
        if (res) {
          this.toastComponent.presentToast(
            'successfully',
            null,
            null,
            'success'
          );
        } else {
          console.log('failed');
        }
      });
  }

  public async restoreData() {
    this.geolocationService.stop();
    this.toastComponent.presentToast('restoring', null, 60000);

    this.firebaseService
      .getData(
        '/dashboard_information',
        this.authenticationService.userData.uid
      )
      .subscribe(async (data) => {
        for (const [value] of Object.entries(AppConstant.backUpKeys)) {
          await this.storage.set(value, data[value]);
        }
        this.timerService.getTotalTime();
        this.odoTripService.getOdoTrip();
        this.topSpeedService.getTopSpeed();
        this.timerService.getAverageSpeedTotalTime();
        this.geolocationService.startGeolocation();
        this.toastComponent.presentToast('successfully', null, null, 'success');
      });
  }
}
