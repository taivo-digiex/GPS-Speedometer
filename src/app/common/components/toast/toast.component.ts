import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-toast',
  template: '',
})
export class ToastComponent {
  constructor(
    private toastController: ToastController,
    private translateService: TranslateService
  ) {}

  public async presentToast(msg: any, value: any, time: number, color: string) {
    this.toastController
      .dismiss()
      .then(() => {})
      .catch(() => {})
      .finally(() => {});

    await this.toastController
      .create({
        message: this.translateService.instant(msg, { value: value }),
        duration: time,
        position: 'top',
        cssClass: 'custom-toast',
        mode: 'ios',
        color: color || 'dark',
        buttons: [
          {
            icon: 'close-outline',
            side: 'end',
            role: 'cancel',
          },
        ],
      })
      .then((toast) => {
        toast.present();
      });
  }

  public dismissToast() {
    this.toastController
      .dismiss()
      .then(() => {})
      .catch(() => {})
      .finally(() => {});
  }
}
