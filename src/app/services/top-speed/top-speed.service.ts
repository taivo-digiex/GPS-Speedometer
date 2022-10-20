import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const TOP_SPEED = 'topSpeed';

@Injectable({
  providedIn: 'root',
})
export class TopSpeedService {
  public topSpeed: number;

  constructor(private storage: Storage) {}

  public async getTopSpeed() {
    await this.storage
      .get(TOP_SPEED)
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
    await this.storage.set(TOP_SPEED, this.topSpeed);
  }

  public async clearTopSpeed() {
    await this.storage.remove(TOP_SPEED).then(() => this.getTopSpeed());
  }
}
