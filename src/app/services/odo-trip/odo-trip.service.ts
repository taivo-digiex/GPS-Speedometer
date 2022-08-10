import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import AppConstant from 'src/app/utilities/app-constant';

@Injectable({
  providedIn: 'root',
})
export class OdoTripService {
  public currentOdo: number;
  public currentTrip: number;

  private lastOdo: number;
  private lastTrip: number;

  constructor(private storage: Storage) {}

  public getOdoTrip() {
    this.getOdo();
    this.getTrip();
  }

  public async saveOdo(currentOdo: number) {
    if (!isNaN(currentOdo) && !isNaN(this.lastOdo)) {
      this.currentOdo = this.lastOdo + currentOdo;
      this.lastOdo = this.currentOdo;
      await this.storage.set(AppConstant.STORAGE_KEYS.ODO, this.currentOdo);
    }
  }

  public async saveTrip(currentTrip: number) {
    if (!isNaN(currentTrip) && !isNaN(this.lastTrip)) {
      this.currentTrip = this.lastTrip + currentTrip;
      this.lastTrip = this.currentTrip;
      await this.storage.set(AppConstant.STORAGE_KEYS.TRIP, this.currentTrip);
    }
  }

  public async clearTrip() {
    await this.storage.remove(AppConstant.STORAGE_KEYS.TRIP);
    this.getTrip();
  }

  private async getOdo() {
    this.currentOdo = 0;
    await this.storage
      .get(AppConstant.STORAGE_KEYS.ODO)
      .then((val) => {
        if (val) {
          this.lastOdo = val;
        } else {
          this.lastOdo = 0;
          this.saveOdo(0);
        }
      })
      .catch(() => {});
  }

  private async getTrip() {
    this.currentTrip = 0;
    await this.storage
      .get(AppConstant.STORAGE_KEYS.TRIP)
      .then((val) => {
        if (val) {
          this.lastTrip = val;
        } else {
          this.lastTrip = 0;
          this.saveTrip(0);
        }
      })
      .catch(() => {});
  }
}
