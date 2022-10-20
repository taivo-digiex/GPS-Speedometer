import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const ODO_KEY = 'odo';
const TRIP_KEY = 'trip';
const AVERAGE_SPEED_TRIP = 'averageSpeedTrip';

@Injectable({
  providedIn: 'root',
})
export class OdoTripService {
  public odo: number;
  public trip: number;
  public averageSpeedTrip: number;

  constructor(private storage: Storage) {}

  public getOdoTrip() {
    this.getOdo();
    this.getTrip();
    this.getAverageSpeedTrip();
  }

  public async saveOdo(newOdo: number) {
    if (!isNaN(newOdo) && !isNaN(this.odo)) {
      this.odo = this.odo + newOdo;
      await this.storage.set(ODO_KEY, this.odo);
    }
  }

  public async saveTrip(newTrip: number) {
    if (!isNaN(newTrip) && !isNaN(this.trip)) {
      this.trip = this.trip + newTrip;
      await this.storage.set(TRIP_KEY, this.trip);
    }
  }

  public async saveAverageSpeedTrip(newAverageSpeedTrip: number) {
    if (!isNaN(newAverageSpeedTrip) && !isNaN(this.trip)) {
      this.averageSpeedTrip = this.averageSpeedTrip + newAverageSpeedTrip;
      await this.storage.set(AVERAGE_SPEED_TRIP, this.averageSpeedTrip);
    }
  }

  public async clearTrip() {
    await this.storage.remove(TRIP_KEY).then(() => this.getTrip());
  }

  public async clearAverageSpeedTrip() {
    await this.storage
      .remove(AVERAGE_SPEED_TRIP)
      .then(() => this.getAverageSpeedTrip());
  }

  private async getOdo() {
    await this.storage
      .get(ODO_KEY)
      .then((val) => {
        if (val) {
          this.odo = val;
        } else {
          this.odo = 0;
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
          this.trip = val;
        } else {
          this.trip = 0;
          this.saveTrip(0);
        }
      })
      .catch(() => {});
  }

  private async getAverageSpeedTrip() {
    await this.storage
      .get(AVERAGE_SPEED_TRIP)
      .then((val) => {
        if (val) {
          this.averageSpeedTrip = val;
        } else {
          this.averageSpeedTrip = 0;
          this.saveAverageSpeedTrip(0);
        }
      })
      .catch(() => {});
  }
}
