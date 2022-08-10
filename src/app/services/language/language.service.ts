import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { TranslateService } from '@ngx-translate/core';
import AppConstant from 'src/app/utilities/app-constant';
import AppUtil from 'src/app/utilities/app-util';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  public selected: string;

  constructor(
    private translateService: TranslateService,
    private storage: Storage
  ) {}

  public async setInitialAppLanguage() {
    let language = this.translateService.getBrowserLang();
    const checkLng = AppUtil.getLanguages(
      AppConstant
    ).find(function (e) {
      return e.value == language;
    });
    if (checkLng == undefined) {
      this.translateService.setDefaultLang('en');
      await this.storage.get(AppConstant.STORAGE_KEYS.LANGUAGE).then(() => {
        this.selected = 'en';
        this.setLanguage('en');
      });
    } else {
      this.translateService.setDefaultLang(language);
      await this.storage.get(AppConstant.STORAGE_KEYS.LANGUAGE).then((val) => {
        if (val) {
          this.selected = val;
          this.setLanguage(val);
        } else {
          this.selected = language;
          this.setLanguage(language);
        }
      });
    }
  }

  public async setLanguage(lng) {
    this.translateService.use(lng);
    this.selected = lng;
    await this.storage.set(AppConstant.STORAGE_KEYS.LANGUAGE, lng);
  }
}
