import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LanguageService } from 'src/app/services/language/language.service';
import { MaxSpeedService } from 'src/app/services/max-speed/max-speed.service';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public languages = [];
  public selected: string;

  public langIcon: string = 'language';
  public trashIcon: string = 'trash';

  constructor(
    private location: Location,
    private toastController: ToastController,
    private languageService: LanguageService,
    private maxSpeedService: MaxSpeedService,
    private translateService: TranslateService
  ) {}

  public ngOnInit() {
    this.getLangSelected();
  }

  private getLangSelected() {
    this.languages = this.languageService.getLanguages();
    this.selected = this.languageService.selected;
  }

  public clearMaxSpeed() {
    this.maxSpeedService.saveMaxSpeed(0);
    this.presentToast('TOAST.clearMaxSpeedSuccess', null, 1000);
  }

  public selectLng(ev: any) {
    const lng = ev.target.value;
    this.languageService.setLanguage(lng);
  }

  public back() {
    this.location.back();
  }

  private async presentToast(msg: string, value: any, time: number) {
    const toast = await this.toastController.create({
      message: this.translateService.instant(msg, { value: value }),
      duration: time,
    });
    await toast.present();
  }
}
