import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LanguageService } from 'src/app/services/language/language.service';
import { MaxSpeedService } from 'src/app/services/max-speed/max-speed.service';
import { ToastComponent } from 'src/app/common/components/toast/toast.component';

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
  public downloadIcon: string = 'download';

  constructor(
    private location: Location,
    private languageService: LanguageService,
    private maxSpeedService: MaxSpeedService,
    private toast: ToastComponent
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
    this.toast.presentToast('TOAST.clearMaxSpeedSuccess', null, 1000);
  }

  public selectLng(ev: any) {
    const lng = ev.target.value;
    this.languageService.setLanguage(lng);
  }

  public back() {
    this.location.back();
  }
}
