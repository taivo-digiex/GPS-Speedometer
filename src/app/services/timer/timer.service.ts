import { EventEmitter, Injectable, Output } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import AppConstant from 'src/app/utilities/app-constant';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  @Output() timerData = new EventEmitter();
  @Output() icon = new EventEmitter();
  @Output() totalTime = new EventEmitter();

  public totalElapsedTimeInterval: any;
  public totalElapsedTime: number;
  public timerInterval: any;
  public hiddenStartIcon = false;
  public currentTotalTime: number;
  public lastTotalTime: number;
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
    this.totalTime.emit(this.convertedTotalTime);
  }

  public async getTotalTime() {
    await this.storage
      .get(AppConstant.STORAGE_KEYS.TOTAL_TIME)
      .then(async (val) => {
        if (val) {
          this.lastTotalTime = val;
          this.currentTotalTime = val;
        } else {
          this.lastTotalTime = 0;
          this.currentTotalTime = 0;
          this.saveTotalTime(0);
        }
        this.convertTotalTravelTime();
      })
      .catch(() => {});
  }

  public async saveTotalTime(time: number) {
    if (!isNaN(this.lastTotalTime)) {
      this.currentTotalTime = this.lastTotalTime + time;
      this.lastTotalTime = this.currentTotalTime;
      await this.storage
        .set(AppConstant.STORAGE_KEYS.TOTAL_TIME, this.currentTotalTime)
        .then(() => {});
      this.convertTotalTravelTime();
    }
  }

  public async resetTotalTime() {
    await this.storage.remove(AppConstant.STORAGE_KEYS.TOTAL_TIME).then(() => {
      this.getTotalTime();
    });
  }
}
