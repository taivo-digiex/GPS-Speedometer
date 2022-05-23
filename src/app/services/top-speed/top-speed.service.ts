import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const TS_KEY = 'top-speed';

@Injectable({
  providedIn: 'root',
})
export class TopSpeedService {
  public topSpeed: number;

  constructor(private storage: Storage) {}

  public async getTopSpeed() {
    await this.storage
      .get(TS_KEY)
      .then((val) => {
        if (val) {
          this.topSpeed = val;
          this.saveTopSpeed(val);
        } else {
          this.topSpeed = 0;
          this.saveTopSpeed(0);
        }
      })
      .catch(() => {});
  }

  public async saveTopSpeed(speed: number) {
    const topSpeedArr = [];
    topSpeedArr.push(speed);
    const topSpeed = Math.max(this.topSpeed, ...topSpeedArr);

    if (!isNaN(topSpeed)) {
      this.topSpeed = topSpeed;
      await this.storage.set(TS_KEY, topSpeed);
    }
  }

  public async clearTopSpeed() {
    await this.storage.remove(TS_KEY);
    this.getTopSpeed();
  }
}
