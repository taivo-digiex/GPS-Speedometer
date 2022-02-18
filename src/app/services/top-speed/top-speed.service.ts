import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const MS_KEY = 'max-speed';

@Injectable({
  providedIn: 'root',
})
export class TopSpeedService {
  public topSpeed: number;

  constructor(private storage: Storage) {}

  public setDefaultTopSpeed() {
    this.storage.get(MS_KEY).then((val) => {
      if (val) {
        this.saveTopSpeed(val);
        this.topSpeed = val;
      } else {
        this.saveTopSpeed(0);
        this.topSpeed = 0;
      }
    });
  }

  public saveTopSpeed(speed: number) {
    const topSpeedArr = [];
    topSpeedArr.push(speed);
    const topSpeed = Math.max(this.topSpeed, ...topSpeedArr);
    this.topSpeed = topSpeed;
    this.storage.set(MS_KEY, topSpeed);
  }
}
