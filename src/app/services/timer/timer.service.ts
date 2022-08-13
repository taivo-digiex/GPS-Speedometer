import { EventEmitter, Injectable, Output } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import AppConstant from 'src/app/utilities/app-constant';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  @Output() timerData = new EventEmitter();
  @Output() icon = new EventEmitter();
  @Output() totalTimeEmit = new EventEmitter();

  public totalElapsedTimeInterval: any;
  public totalElapsedTime: number;
  public timerInterval: any;
  public hiddenStartIcon = false;
  public totalTime: number;
  public avgSpeedTotalTime: number;
  public convertedTotalTime: string;

  constructor(private storage: Storage) {}

  private async convertTotalTravelTime() {
    const time = await this.storage
      .get(AppConstant.STORAGE_KEYS.TOTAL_TIME)
      .then()
      .catch();
    this.convertedTotalTime =
      Math.floor(time / 3600)
        .toString()
        .padStart(2, '0') +
      ':' +
      (Math.floor(time / 60) % 60).toString().padStart(2, '0') +
      ':' +
      (time % 60).toString().padStart(2, '0');
    this.totalTimeEmit.emit(this.convertedTotalTime);
  }

  public async getTotalTime() {
    await this.storage
      .get(AppConstant.STORAGE_KEYS.TOTAL_TIME)
      .then(async (val) => {
        if (val) {
          this.totalTime = val;
        } else {
          this.totalTime = 0;
          this.saveTotalTime(0);
        }
        this.convertTotalTravelTime();
      })
      .catch(() => {});
  }

  public async getAvgSpeedTotalTime() {
    await this.storage
      .get(AppConstant.STORAGE_KEYS.AVG_SPEED_TOTAL_TIME)
      .then(async (val) => {
        if (val) {
          this.avgSpeedTotalTime = val;
        } else {
          this.avgSpeedTotalTime = 0;
          this.saveAvgSpeedTotalTime(0);
        }
      })
      .catch(() => {});
  }

  public async saveTotalTime(time: number) {
    if (!isNaN(this.totalTime)) {
      this.totalTime = this.totalTime + time;
      await this.storage
        .set(AppConstant.STORAGE_KEYS.TOTAL_TIME, this.totalTime)
        .then(() => this.convertTotalTravelTime());
    }
  }

  public async saveAvgSpeedTotalTime(time: number) {
    if (!isNaN(this.avgSpeedTotalTime)) {
      this.avgSpeedTotalTime = this.avgSpeedTotalTime + time;
      await this.storage
        .set(
          AppConstant.STORAGE_KEYS.AVG_SPEED_TOTAL_TIME,
          this.avgSpeedTotalTime
        )
        .then(() => this.convertTotalTravelTime());
    }
  }

  public async resetTotalTime() {
    await this.storage
      .remove(AppConstant.STORAGE_KEYS.TOTAL_TIME)
      .then(() => this.getTotalTime());
  }

  public async resetAvgSpeedTotalTime() {
    await this.storage
      .remove(AppConstant.STORAGE_KEYS.AVG_SPEED_TOTAL_TIME)
      .then(() => this.getAvgSpeedTotalTime());
  }
}
