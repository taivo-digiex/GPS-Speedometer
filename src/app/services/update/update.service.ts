import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertComponent } from 'src/app/common/components/alert/alert.component';
import { AppUpdateModel } from 'src/app/common/models/update.model';
import { App } from '@capacitor/app';
import { Network } from '@capacitor/network';
import { ToastComponent } from 'src/app/common/components/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  public versionNumber: string;
  private downloadLatest: string;

  constructor(
    private http: HttpClient,
    private alertComponent: AlertComponent,
    private toastComponent: ToastComponent
  ) {}

  public async checkForUpdate(isManual: boolean) {
    if ((await Network.getStatus()).connected) {
      this.http
        .get(
          'https://api.github.com/repos/vdt2210/GPS-Speedometer/releases/latest'
        )
        .subscribe(async (info: AppUpdateModel) => {
          try {
            this.versionNumber = (await App.getInfo()).version;
            const splittedVersion = this.versionNumber
              .split(/[.-]/)
              .filter(Number);
            const serverVersion = info.tag_name.split(/[.-]/).filter(Number);

            if (isManual) {
              this.toastComponent.presentToast(
                'toast.checkingForUpdate',
                null,
                null,
                null
              );
            }
            console.log(serverVersion);

            if (
              (serverVersion[0] > splittedVersion[0] ||
                serverVersion[1] > splittedVersion[1] ||
                serverVersion[2] > splittedVersion[2]) &&
              info
            ) {
              this.downloadLatest = info.assets[0].browser_download_url;
              await this.alertComponent.presentAlert(
                'alert.header.h2',
                info.tag_name,
                info.body,
                null,
                'common.later',
                'common.download',
                (info.assets[0].size * 9.5367431640625e-7).toFixed(2),
                this,
                this.downloadNewAppVersion
              );
            } else if (isManual) {
              await this.alertComponent.presentAlertOneBtn(
                'alert.header.h3',
                this.versionNumber,
                'alert.msg.m2',
                null,
                'common.ok'
              );
            }

            if (isManual) {
              this.toastComponent.dismissToast();
            }
          } catch (e) {
            this.toastComponent.presentToast(
              'toast.checkForUpdateFailed',
              e,
              2000,
              'warning'
            );
          }
        });
    } else {
      if (isManual) {
        await this.alertComponent.presentAlertOneBtn(
          'alert.header.h4',
          null,
          'alert.msg.m3',
          null,
          'common.ok'
        );
      }
    }
  }

  private async downloadNewAppVersion() {
    window.open(this.downloadLatest, '_blank');
  }
}
