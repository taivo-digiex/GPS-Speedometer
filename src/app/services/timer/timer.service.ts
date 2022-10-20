import { EventEmitter, Injectable, Output } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const TOTAL_TIME = 'totalTime';
const AVERAGE_SPEED_TOTAL_TIME = 'averageSpeedTotalTime';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  @Output() totalTimeEmit = new EventEmitter();

  public totalTime: number;
  public averageSpeedTotalTime: number;
  public convertedTotalTime: string;

  constructor(private storage: Storage) {}

  public async getTotalTime() {
    await this.storage
      .get(TOTAL_TIME)
      .then(async (val) => {
        if (val) {
          this.totalTime = val;
          this.convertTotalTravelTime();
        } else {
          this.totalTime = 0;
          this.saveTotalTime(0);
        }
      })
      .catch(() => {});
  }

  public async getAverageSpeedTotalTime() {
    await this.storage
      .get(AVERAGE_SPEED_TOTAL_TIME)
      .then(async (val) => {
        if (val) {
          this.averageSpeedTotalTime = val;
        } else {
          this.averageSpeedTotalTime = 0;
          this.saveAverageSpeedTotalTime(0);
        }
      })
      .catch(() => {});
  }

  public async saveTotalTime(time: number) {
    if (!isNaN(this.totalTime)) {
      this.totalTime = this.totalTime + time;
      await this.storage
        .set(TOTAL_TIME, this.totalTime)
        .then(() => this.convertTotalTravelTime());
    }
  }

  public async saveAverageSpeedTotalTime(time: number) {
    if (!isNaN(this.averageSpeedTotalTime)) {
      this.averageSpeedTotalTime = this.averageSpeedTotalTime + time;
      await this.storage.set(
        AVERAGE_SPEED_TOTAL_TIME,
        this.averageSpeedTotalTime
      );
    }
  }

  public async resetTotalTime() {
    await this.storage.remove(TOTAL_TIME).then(() => this.getTotalTime());
  }

  public async resetAverageSpeedTotalTime() {
    await this.storage
      .remove(AVERAGE_SPEED_TOTAL_TIME)
      .then(() => this.getAverageSpeedTotalTime());
  }

  private async convertTotalTravelTime() {
    this.convertedTotalTime =
      Math.floor(this.totalTime / 3600)
        .toString()
        .padStart(2, '0') +
      ':' +
      (Math.floor(this.totalTime / 60) % 60).toString().padStart(2, '0') +
      ':' +
      (this.totalTime % 60).toString().padStart(2, '0');
    this.totalTimeEmit.emit(this.convertedTotalTime);
  }
}
