import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import AppConstant from 'src/app/utilities/app-constant';

@Injectable({
  providedIn: 'root',
})
export class OdoTripService {
  public odo: number;
  public trip: number;
  public avgSpeedTrip: number;

  constructor(private storage: Storage) {}

  public getOdoTrip() {
    this.getOdo();
    this.getTrip();
    this.getAvgSpeedTrip();
  }

  public async saveOdo(newOdo: number) {
    if (!isNaN(newOdo) && !isNaN(this.odo)) {
      this.odo = this.odo + newOdo;
      await this.storage.set(AppConstant.STORAGE_KEYS.ODO, this.odo);
    }
  }

  public async saveTrip(newTrip: number) {
    if (!isNaN(newTrip) && !isNaN(this.trip)) {
      this.trip = this.trip + newTrip;
      await this.storage.set(AppConstant.STORAGE_KEYS.TRIP, this.trip);
    }
  }

  public async saveAvgSpeedTrip(newAvgSpeedTrip: number) {
    if (!isNaN(newAvgSpeedTrip) && !isNaN(this.trip)) {
      this.avgSpeedTrip = this.avgSpeedTrip + newAvgSpeedTrip;
      await this.storage.set(
        AppConstant.STORAGE_KEYS.AVG_SPEED_TRIP,
        this.avgSpeedTrip
      );
    }
  }

  public async clearTrip() {
    await this.storage
      .remove(AppConstant.STORAGE_KEYS.TRIP)
      .then(() => this.getTrip());
  }

  public async clearAvgSpeedTrip() {
    await this.storage
      .remove(AppConstant.STORAGE_KEYS.AVG_SPEED_TRIP)
      .then(() => this.getAvgSpeedTrip());
  }

  private async getOdo() {
    await this.storage
      .get(AppConstant.STORAGE_KEYS.ODO)
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
      .get(AppConstant.STORAGE_KEYS.TRIP)
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

  private async getAvgSpeedTrip() {
    await this.storage
      .get(AppConstant.STORAGE_KEYS.AVG_SPEED_TRIP)
      .then((val) => {
        if (val) {
          this.avgSpeedTrip = val;
        } else {
          this.avgSpeedTrip = 0;
          this.saveAvgSpeedTrip(0);
        }
      })
      .catch(() => {});
  }
}
