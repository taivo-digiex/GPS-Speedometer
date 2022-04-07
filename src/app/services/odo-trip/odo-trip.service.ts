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

  public lastOdo: number;
  public lastTrip: number;

  constructor(private storage: Storage) {}

  public getOdoTrip() {
    this.getOdo();
    this.getTrip();
  }

  private async getOdo() {
    await this.storage.get(ODO_KEY).then((val) => {
      if (val) {
        this.saveOdo(val);
        this.lastOdo = val;
        this.currentOdo = val;
      } else {
        this.saveOdo(0);
        this.lastOdo = 0;
        this.currentOdo = 0;
      }
    });
  }

  private async getTrip() {
    await this.storage.get(TRIP_KEY).then((val) => {
      if (val) {
        this.saveTrip(val);
        this.lastTrip = val;
        this.currentTrip = val;
      } else {
        this.saveTrip(0);
        this.lastTrip = 0;
        this.currentTrip = 0;
      }
    });
  }

  public saveOdoTrip(value: number) {
    this.saveOdo(value);
    this.saveTrip(value);
  }

  private async saveOdo(currentOdo: number) {
    if (!isNaN(currentOdo) && !isNaN(this.lastOdo)) {
      const odo = this.lastOdo + currentOdo;
      this.currentOdo = odo;
      await this.storage.set(ODO_KEY, odo);
    }
  }

  private async saveTrip(currentTrip: number) {
    if (!isNaN(currentTrip) && !isNaN(this.lastTrip)) {
      const trip = this.lastTrip + currentTrip;
      this.currentTrip = trip;
      await this.storage.set(TRIP_KEY, trip);
    }
  }

  public async clearTrip() {
    await this.storage.remove(TRIP_KEY);
    this.currentTrip = 0;
  }
}
