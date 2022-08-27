import { Component } from '@angular/core';
import { AlertButton, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
// import { Mode } from 'fs';

interface AlertOptions {
  header?: string;
  headerValue?: string | number;
  subHeader?: string;
  message?: string;
  messageValue?: string | number;
  cssClass?: string | string[];
  inputs?: AlertInput[];
  buttons?: AlertButton[] | string[];
  backdropDismiss?: boolean;
  translucent?: boolean;
  animated?: boolean;
  htmlAttributes?: { [key: string]: any };
  // mode?: 'ios';
  // mode?: Mode;
  keyboardClose?: boolean;
  id?: string;
}

interface AlertInput {
  type?: 'checkbox' | 'radio' | 'textarea';
  name?: string;
  placeholder?: string;
  value?: any;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  handler?: (input: AlertInput) => void;
  min?: string | number;
  max?: string | number;
  cssClass?: string | string[];
  attributes?: { [key: string]: any };
  tabindex?: number;
}

@Component({
  selector: 'app-alert',
  template: '',
})
export class AlertComponent {
  constructor(
    private alertController: AlertController,
    private translateService: TranslateService
  ) {}

  public async alertWithButtons(
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

  public async alertWithButton(
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

  public async alertWithInput(content: AlertOptions, inputs: AlertInput[]) {
    const alert = await this.alertController.create({
      header: this.translateService.instant(content.header, {
        value: content.headerValue,
      }),
      message: this.translateService.instant(content.message, {
        value: content.messageValue,
      }),
      buttons: content.buttons.map((el) => ({
        ...el,
        text: this.translateService.instant(el.text),
      })),
      inputs: inputs.map((el) => ({
        ...el,
        label: this.translateService.instant(el.label),
      })),
    });

    await alert.present();
  }
}
