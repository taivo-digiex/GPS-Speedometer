import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const MS_KEY = 'max-speed';

@Injectable({
  providedIn: 'root',
})
export class MaxSpeedService {
  public maxSpeed: number;

  constructor(private storage: Storage) {}

  public getMaxSpeed() {
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

  public saveMaxSpeed(maxSpeed: number) {
    this.maxSpeed = maxSpeed;
    this.storage.set(MS_KEY, maxSpeed);
  }
}
