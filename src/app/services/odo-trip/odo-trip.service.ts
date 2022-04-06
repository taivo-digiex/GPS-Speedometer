import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const ODO_KEY = 'odo';
const TRIP_KEY = 'trip';

@Injectable({
  providedIn: 'root',
})
export class OdoTripService {
  public odo: number;
  public trip: number;

  constructor(private storage: Storage) {}

  public getOdoTrip() {
    this.getOdo();
    this.getTrip();
  }

  private async getOdo() {
    await this.storage.get(ODO_KEY).then((val) => {
      if (val) {
        this.saveOdo(val);
        this.odo = val;
      } else {
        this.saveOdo(0);
        this.odo = 0;
      }
    });
  }

  public async saveOdo(currentOdo: number) {
    const odo = this.odo + currentOdo;
    if (!isNaN(odo)) {
      this.odo = odo;
      await this.storage.set(ODO_KEY, odo);
    }
  }

  private async getTrip() {
    await this.storage.get(TRIP_KEY).then((val) => {
      if (val) {
        this.saveTrip(val);
        this.trip = val;
      } else {
        this.saveTrip(0);
        this.trip = 0;
      }
    });
  }

  public async saveTrip(currentTrip: number) {
    const trip = this.trip + currentTrip;
    if (!isNaN(trip)) {
      this.trip = trip;
      await this.storage.set(TRIP_KEY, trip);
    }
  }

  public async clearTrip() {
    await this.storage.remove(TRIP_KEY);
    this.trip = 0;
  }
}
