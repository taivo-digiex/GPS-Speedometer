import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, Observer } from 'rxjs';
import AppConstant from 'src/app/utilities/app-constant';

@Injectable({
  providedIn: 'root',
})
export class TopSpeedService {
  public topSpeed: number;

  private storageObserver: any;
  public storageObservable: any;

  constructor(private storage: Storage) {
    this.storageObservable = new Observable((observer: Observer<number>) => {
      this.storageObserver = observer;
    });
  }

  public async getTopSpeed() {
    await this.storage
      .get(AppConstant.storageKeys.topSpeed)
      .then((val) => {
        this.topSpeed = val;
        this.storageObserver.next(this.topSpeed);
      })
      .catch(() => {});
  }

  public async saveTopSpeed(speed: number) {
    if (speed == null) {
      return;
    }

    this.topSpeed = Math.max(this.topSpeed, ...[speed]);
    await this.storage.set(AppConstant.storageKeys.topSpeed, this.topSpeed);
    this.storageObserver.next(this.topSpeed);
  }

  public async clearTopSpeed() {
    delete this.topSpeed;
    await this.storage
      .remove(AppConstant.storageKeys.topSpeed)
      .then(() => this.getTopSpeed());
  }
}
