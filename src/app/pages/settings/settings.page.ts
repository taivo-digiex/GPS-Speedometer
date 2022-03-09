import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LanguageService } from 'src/app/services/language/language.service';
import { TopSpeedService } from 'src/app/services/top-speed/top-speed.service';
import { ToastComponent } from 'src/app/common/components/toast/toast.component';
import { UpdateService } from 'src/app/services/update/update.service';

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
    private topSpeedService: TopSpeedService,
    private toast: ToastComponent,
    private updateService: UpdateService
  ) {}

  public ngOnInit() {
    this.getLangSelected();
  }

  private getLangSelected() {
    this.languages = this.languageService.getLanguages();
    this.selected = this.languageService.selected;
  }

  public clearTopSpeed() {
    this.topSpeedService.clearTopSpeed();
    this.toast.presentToast('TOAST.clearTopSpeedSuccess', null, 1000);
  }

  public selectLng(ev: any) {
    const lng = ev.target.value;
    this.languageService.setLanguage(lng);
  }

  public back() {
    this.location.back();
  }

  public checkForUpdate() {
    this.updateService.checkForUpdate(true);
  }
}
