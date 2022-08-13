import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import AppConstant from 'src/app/utilities/app-constant';

@Injectable({
  providedIn: 'root',
})
export class TopSpeedService {
  public topSpeed: number;

  constructor(private storage: Storage) {}

  public async getTopSpeed() {
    await this.storage
      .get(AppConstant.STORAGE_KEYS.TOP_SPEED)
      .then((val) => {
        if (val) {
          this.topSpeed = val;
        } else {
          this.topSpeed = 0;
          this.saveTopSpeed(0);
        }
      })
      .catch(() => {});
  }

  public async saveTopSpeed(speed: number) {
    if (speed == null) {
      return;
    }

    this.topSpeed = Math.max(this.topSpeed, ...[speed]);
    await this.storage.set(AppConstant.STORAGE_KEYS.TOP_SPEED, this.topSpeed);
  }

  public async clearTopSpeed() {
    await this.storage
      .remove(AppConstant.STORAGE_KEYS.TOP_SPEED)
      .then(() => this.getTopSpeed());
  }
}
