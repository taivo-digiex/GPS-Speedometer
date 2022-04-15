import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const ODO_KEY = 'odo';
const TRIP_KEY = 'trip';

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

  private async getOdo() {
    await this.storage
      .get(ODO_KEY)
      .then((val) => {
        if (val) {
          this.lastOdo = 0;
          this.currentOdo = val;
          this.saveOdo(val);
        } else {
          this.lastOdo = 0;
          this.currentOdo = 0;
          this.saveOdo(0);
        }
      })
      .catch(() => {});
  }

  private async getTrip() {
    await this.storage
      .get(TRIP_KEY)
      .then((val) => {
        if (val) {
          this.lastTrip = 0;
          this.currentTrip = val;
          this.saveTrip(val);
        } else {
          this.lastTrip = 0;
          this.currentTrip = 0;
          this.saveTrip(0);
        }
      })
      .catch(() => {});
  }

  public async saveOdo(currentOdo: number) {
    if (!isNaN(currentOdo) && !isNaN(this.lastOdo)) {
      this.currentOdo = this.lastOdo + currentOdo;
      this.lastOdo = this.currentOdo;
      await this.storage.set(ODO_KEY, this.currentOdo);
    }
  }

  public async saveTrip(currentTrip: number) {
    if (!isNaN(currentTrip) && !isNaN(this.lastTrip)) {
      this.currentTrip = this.lastTrip + currentTrip;
      this.lastTrip = this.currentTrip;
      await this.storage.set(TRIP_KEY, this.currentTrip);
    }
  }

  public async clearTrip() {
    await this.storage.remove(TRIP_KEY);
    this.getTrip();
  }
}
