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

  public async presentAlert(
    header: string,
    headervalue: any,
    msg: string,
    msgvalue: any,
    btnCancelTxt: string,
    btnTxt: string,
    btnValue: any,
    context: object,
    action: () => Record<string, any>
  ) {
    const alert = await this.alertController.create({
      header: this.translateService.instant(header, { value: headervalue }),
      message: this.translateService.instant(msg, { value: msgvalue }),
      buttons: [
        {
          text: this.translateService.instant(btnCancelTxt),
          role: 'cancel',
        },
        {
          text: this.translateService.instant(btnTxt, { value: btnValue }),
          handler: action.bind(context),
        },
      ],
    });

    await alert.present();
  }

  public async presentAlertOneBtn(
    header: string,
    headervalue: any,
    msg: string,
    msgvalue: any,
    btnTxt: string
  ) {
    const alert = await this.alertController.create({
      header: this.translateService.instant(header, { value: headervalue }),
      message: this.translateService.instant(msg, { value: msgvalue }),
      buttons: [
        {
          text: this.translateService.instant(btnTxt),
          role: 'confirm',
        },
      ],
    });

    await alert.present();
  }
}
