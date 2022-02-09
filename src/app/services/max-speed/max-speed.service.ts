import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const MS_KEY = 'max-speed';

@Injectable({
  providedIn: 'root',
})
export class MaxSpeedService {
  public maxSpeed: number;

  constructor(private storage: Storage) {}

  public setDefaultMaxSpeed() {
    this.storage.get(MS_KEY).then((val) => {
      if (val) {
        this.saveMaxSpeed(val);
        this.maxSpeed = val;
      } else {
        this.saveMaxSpeed(0);
        this.maxSpeed = 0;
      }
    });
  }

  public saveMaxSpeed(speed: number) {
    const maxSpeedArr = [];
    maxSpeedArr.push(speed);
    const maxSpeed = Math.max(this.maxSpeed, ...maxSpeedArr);
    this.maxSpeed = maxSpeed;
    this.storage.set(MS_KEY, maxSpeed);
  }
}
