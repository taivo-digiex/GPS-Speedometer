import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage-angular';
import { Device } from '@capacitor/device';

const LNG_KEY = 'language';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  public selected: string;

  constructor(private translate: TranslateService, private storage: Storage) {}

  // public async setInitialAppLanguage() {
  //   let language = this.translate.getBrowserLang();
  //   const checkLng = this.getLanguages().find((e) => {
  //     return e.value == language;
  //   });
  //   if (checkLng == undefined) {
  //     this.translate.setDefaultLang('en');
  //     await this.storage.get(LNG_KEY).then(() => {
  //       this.selected = 'en';
  //       this.setLanguage('en');
  //     });
  //   } else {
  //     this.translate.setDefaultLang(language);
  //     await this.storage.get(LNG_KEY).then((val) => {
  //       if (val) {
  //         this.selected = val;
  //         this.translate.use(val);
  //       } else {
  //         this.selected = language;
  //         this.setLanguage(language);
  //       }
  //     });
  //   }
  // }

  public async setInitialAppLanguage() {
    await this.storage.get(LNG_KEY).then(async (val) => {
      if (val) {
        this.setLanguage(val);
      } else {
        this.setLanguage((await Device.getLanguageCode()).value);
      }
    });
  }

  // public getLanguages() {
  //   return [{ value: 'en' }, { value: 'vi' }];
  // }

  public async setLanguage(lng: string) {
    this.selected = lng;
    await this.storage.set(LNG_KEY, lng).then(() => this.translate.use(lng));
  }
}
