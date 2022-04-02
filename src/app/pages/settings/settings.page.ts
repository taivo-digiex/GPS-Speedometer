import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LanguageService } from 'src/app/services/language/language.service';
import { TopSpeedService } from 'src/app/services/top-speed/top-speed.service';
import { ToastComponent } from 'src/app/common/components/toast/toast.component';
import { UpdateService } from 'src/app/services/update/update.service';
import { AlertComponent } from 'src/app/common/components/alert/alert.component';
import { UnitService } from 'src/app/services/unit/unit.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public languages = [];
  public units = [];
  public selectedLanguage: string;
  public selectedUnit: string;

  public langIcon: string = 'language';
  public unitIcon: string = 'speedometer';
  public trashIcon: string = 'trash';
  public downloadIcon: string = 'download';

  constructor(
    private location: Location,
    private languageService: LanguageService,
    private topSpeedService: TopSpeedService,
    private toast: ToastComponent,
    private updateService: UpdateService,
    private alertComponent: AlertComponent,
    private unitService: UnitService
  ) {}

  public ngOnInit() {
    this.getLangSelected();
    this.getUnitSelected();
  }

  private getLangSelected() {
    this.languages = this.languageService.getLanguages();
    this.selectedLanguage = this.languageService.selected;
  }

  private getUnitSelected() {
    this.units = this.unitService.getUnits();
    this.selectedUnit = this.unitService.unit;
  }

  public async confirmClear() {
    await this.alertComponent.presentAlert(
      'alert.header.h1',
      null,
      'alert.msg.m1',
      null,
      'button.cancel',
      'button.confirm',
      null,
      this,
      this.clearTopSpeed
    );
  }

  private async clearTopSpeed() {
    this.topSpeedService.clearTopSpeed();
    this.toast.presentToast('toast.clear_success', null, 1000);
  }

  public selectLng(ev: any) {
    this.languageService.setLanguage(ev.target.value);
  }

  public back() {
    this.location.back();
  }

  public checkForUpdate() {
    this.updateService.checkForUpdate(true);
  }

  public changeUnit(ev: any) {
    this.unitService.saveUnit(ev.target.value);
  }
}
