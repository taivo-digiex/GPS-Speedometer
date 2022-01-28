import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alert',
  template: '',
})
export class AlertComponent {
  constructor(
    private alertController: AlertController,
    private translateService: TranslateService
  ) {}

  public async presentAlertConfirm(
    header: any,
    headervalue: any,
    msg: any,
    msgvalue: any
  ) {
    const alert = await this.alertController.create({
      header: this.translateService.instant(header, { value: headervalue }),
      message: this.translateService.instant(msg, { value: msgvalue }),
      buttons: [
        {
          text: this.translateService.instant('ALERT.BTN.cancel'),
          role: 'cancel',
          id: 'cancel-button',
        },
        {
          text: this.translateService.instant('ALERT.BTN.confirm'),
          role: 'confirm',
          id: 'confirm-button',
        },
      ],
    });

    await alert.present();
  }
}
