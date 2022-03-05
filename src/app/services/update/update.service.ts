import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { AlertComponent } from 'src/app/common/components/alert/alert.component';

interface AppUpdate {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: [
    {
      url: string;
      id: number;
      node_id: string;
      name: string;
      label: string;
      uploader: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
        site_admin: boolean;
      };
      content_type: string;
      state: string;
      size: number;
      download_count: number;
      created_at: string;
      updated_at: string;
      browser_download_url: string;
    }
  ];
  tarball_url: string;
  zipball_url: string;
  body: string;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  private checkLatest: string =
    'https://api.github.com/repos/vdt2210/GPS-Speedometer/releases/latest';

  private downloadLatest: string;
  // downloadLatest =
  //   'https://api.github.com/repos/vdt2210/GPS-Speedometer/releases/latest/download/GPS-Spedometer.apk';

  // updateExample =
  //   'https://devdactic.fra1.digitaloceanspaces.com/tutorial/version.json';
  // maintenanceExample =
  //   'https://devdactic.fra1.digitaloceanspaces.com/tutorial/maintenance.json';

  constructor(
    private http: HttpClient,
    private appVersion: AppVersion,
    private alertComponent: AlertComponent
  ) {}

  public async checkForUpdate() {
    this.http.get(this.checkLatest).subscribe(async (info: AppUpdate) => {
      if (info) {
        const versionNumber = await this.appVersion.getVersionNumber();
        const splittedVersion = versionNumber.split(/[.-]/);
        const serverVersion = info.tag_name.split(/[.-]/);

        if (
          serverVersion[0] > splittedVersion[0] ||
          serverVersion[1] > splittedVersion[1] ||
          serverVersion[2] > splittedVersion[2]
        ) {
          await this.alertComponent.presentAlert(
            'ALERT.HEADER.H2',
            null,
            'COMMON.version',
            info.tag_name,
            info.body,
            null,
            'COMMON.later',
            'COMMON.download',
            (info.assets[0].size * 9.5367431640625e-7).toFixed(2) + ' MB',
            this,
            this.openAppStoreEntry
          );
          this.downloadLatest = info.assets[0].browser_download_url;
        } else {
          await this.alertComponent.presentAlertOneBtn(
            'ALERT.HEADER.H3',
            null,
            'COMMON.currVersion',
            versionNumber,
            'ALERT.MSG.M2',
            null,
            'COMMON.ok'
          );
        }
      }
    });
  }

  private async openAppStoreEntry() {
    window.open(this.downloadLatest, '_blank');
  }
}
