import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { AlertComponent } from 'src/app/common/components/alert/alert.component';
import { AppUpdateModel } from 'src/app/common/models/update.model';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  private downloadLatest: string;

  constructor(
    private http: HttpClient,
    private appVersion: AppVersion,
    private alertComponent: AlertComponent
  ) {}

  public async checkForUpdate(isManual: boolean) {
    this.http
      .get(
        'https://api.github.com/repos/vdt2210/GPS-Speedometer/releases/latest'
      )
      .subscribe(async (info: AppUpdateModel) => {
        if (info) {
          const versionNumber = await this.appVersion.getVersionNumber();
          const splittedVersion = versionNumber.split(/[.-]/);
          const serverVersion = info.tag_name.split(/[.-]/);

          if (
            serverVersion[0] > splittedVersion[0] ||
            serverVersion[1] > splittedVersion[1] ||
            serverVersion[2] > splittedVersion[2]
          ) {
            this.downloadLatest = info.assets[0].browser_download_url;
            await this.alertComponent.presentAlert(
              'ALERT.HEADER.H2',
              info.tag_name,
              info.body,
              null,
              'COMMON.later',
              'COMMON.download',
              (info.assets[0].size * 9.5367431640625e-7).toFixed(2),
              this,
              this.downloadNewAppVersion
            );
          } else if (isManual) {
            await this.alertComponent.presentAlertOneBtn(
              'ALERT.HEADER.H3',
              versionNumber,
              'ALERT.MSG.M2',
              null,
              'COMMON.ok'
            );
          }
        }
      });
  }

  private async downloadNewAppVersion() {
    window.open(this.downloadLatest, '_blank');
  }
}
