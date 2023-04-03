import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, Observer } from 'rxjs';
import AppConstant from 'src/app/utilities/app-constant';

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
  public params = {
    odo: null,
    trip: null,
    averageSpeedTrip: null,
  };

  private storageObserver: any;
  public storageObservable: any;

  constructor(private storage: Storage) {
    this.storageObservable = new Observable((observer: Observer<object>) => {
      this.storageObserver = observer;
    });
  }

  public getOdoTrip() {
    this.getOdo();
    this.getTrip();
    this.getAverageSpeedTrip();
  }

  public async saveOdo(newOdo: number) {
    if (!isNaN(newOdo) && !isNaN(this.odo)) {
      this.odo = this.odo + newOdo;
      this.params = { ...this.params, odo: this.odo };
      await this.storage.set(ODO_KEY, this.odo);
      this.storageObserver.next(this.params);
    }
  }

  public async saveTrip(newTrip: number) {
    if (!isNaN(newTrip) && !isNaN(this.trip)) {
      this.trip = this.trip + newTrip;
      this.params = { ...this.params, trip: this.trip };
      await this.storage.set(TRIP_KEY, this.trip);
      this.storageObserver.next(this.params);
    }
  }

  public async saveAverageSpeedTrip(newAverageSpeedTrip: number) {
    if (!isNaN(newAverageSpeedTrip) && !isNaN(this.trip)) {
      this.averageSpeedTrip = this.averageSpeedTrip + newAverageSpeedTrip;
      this.params = { ...this.params, averageSpeedTrip: this.averageSpeedTrip };
      await this.storage.set(AVERAGE_SPEED_TRIP, this.averageSpeedTrip);
      this.storageObserver.next(this.params);
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
    // await this.storage
    //   .get(ODO_KEY)
    //   .then((val) => {
    //     if (val) {
    //       this.odo = val;
    //     } else {
    //       this.odo = 0;
    //       this.saveOdo(0);
    //     }
    //   })
    //   .catch(() => {});

    await this.storage
      .get(AppConstant.storageKeys.odo)
      .then((val) => {
        this.odo = val;
        this.params = { ...this.params, odo: val };
        this.storageObserver.next(this.params);
      })
      .catch(() => {});
  }

  private async getTrip() {
    // await this.storage
    //   .get(TRIP_KEY)
    //   .then((val) => {
    //     if (val) {
    //       this.trip = val;
    //     } else {
    //       this.trip = 0;
    //       this.saveTrip(0);
    //     }
    //   })
    //   .catch(() => {});

    await this.storage
      .get(AppConstant.storageKeys.trip)
      .then((val) => {
        this.trip = val;
        this.params = { ...this.params, trip: val };
        this.storageObserver.next(this.params);
      })
      .catch(() => {});
  }

  private async getAverageSpeedTrip() {
    // await this.storage
    //   .get(AVERAGE_SPEED_TRIP)
    //   .then((val) => {
    //     if (val) {
    //       this.averageSpeedTrip = val;
    //     } else {
    //       this.averageSpeedTrip = 0;
    //       this.saveAverageSpeedTrip(0);
    //     }
    //   })
    //   .catch(() => {});

    await this.storage
      .get(AppConstant.storageKeys.averageSpeedTrip)
      .then((val) => {
        this.averageSpeedTrip = val;
        this.params = { ...this.params, averageSpeedTrip: val };
        this.storageObserver.next(this.params);
      })
      .catch(() => {});
  }
}
