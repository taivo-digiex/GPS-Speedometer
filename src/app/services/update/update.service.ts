import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertComponent } from 'src/app/common/components/alert/alert.component';
import { AppUpdateModel } from 'src/app/common/models/update.model';
import { App } from '@capacitor/app';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  private downloadLatest: string;

  constructor(
    private http: HttpClient,
    private alertComponent: AlertComponent
  ) {}

  public async checkForUpdate(isManual: boolean) {
    if ((await Network.getStatus()).connected) {
      this.http
        .get(
          'https://api.github.com/repos/vdt2210/GPS-Speedometer/releases/latest'
        )
        .subscribe(async (info: AppUpdateModel) => {
          if (info) {
            const versionNumber = (await App.getInfo()).version;
            const splittedVersion = versionNumber.split(/[.-]/);
            const serverVersion = info.tag_name.split(/[.-]/);

            if (
              serverVersion[0] > splittedVersion[0] ||
              serverVersion[1] > splittedVersion[1] ||
              serverVersion[2] > splittedVersion[2]
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
                versionNumber,
                'alert.msg.m2',
                null,
                'common.ok'
              );
            }
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
