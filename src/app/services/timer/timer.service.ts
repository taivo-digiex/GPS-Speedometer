import { EventEmitter, Injectable, Output } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const TT_KEY = 'total-time';

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

  private totalTimerInterval: any;

  constructor(private storage: Storage) {}

  public calculateTime() {
    let elapsedTime = 0;
    const startTime = Date.now() - elapsedTime;

    this.totalElapsedTimeInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;

      const diffInHrs = elapsedTime / 3600000;
      const hh = Math.floor(diffInHrs);

      const diffInMin = (diffInHrs - hh) * 60;
      const mm = Math.floor(diffInMin);

      const diffInSec = (diffInMin - mm) * 60;
      const ss = Math.floor(diffInSec);

      this.totalElapsedTime = hh * 3600000 + mm * 60 + ss;
    }, 1000);
  }

  public stopTotalElapsedTime() {
    clearInterval(this.totalElapsedTimeInterval);
    this.calculateTime();
  }

  public timer() {
    this.hiddenStartIcon = true;
    this.icon.emit(this.hiddenStartIcon);
    let elapsedTime = 0;
    const startTime = Date.now() - elapsedTime;

    this.timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;

      const diffInHrs = elapsedTime / 3600000;
      const hh = Math.floor(diffInHrs);

      const diffInMin = (diffInHrs - hh) * 60;
      const mm = Math.floor(diffInMin);

      const diffInSec = (diffInMin - mm) * 60;
      const ss = Math.floor(diffInSec);

      const formattedHH = hh.toString().padStart(2, '0');
      const formattedMM = mm.toString().padStart(2, '0');
      const formattedSS = ss.toString().padStart(2, '0');

      this.timerData.emit(`${formattedHH}:${formattedMM}:${formattedSS}`);
    }, 1000);
  }

  public stopTimer() {
    this.hiddenStartIcon = false;
    this.timerData.emit('00:00:00');
    this.icon.emit(this.hiddenStartIcon);
    clearInterval(this.timerInterval);
  }

  public convertTotalTravelTime() {
    this.convertedTotalTime =
      Math.floor(this.currentTotalTime / 3600)
        .toString()
        .padStart(2, '0') +
      ':' +
      (Math.floor(this.currentTotalTime / 60) % 60)
        .toString()
        .padStart(2, '0') +
      ':' +
      (this.currentTotalTime % 60).toString().padStart(2, '0');
    this.totalTime.emit(this.convertedTotalTime);
  }

  public async getTotalTime() {
    await this.storage
      .get(TT_KEY)
      .then((val) => {
        if (val) {
          this.lastTotalTime = val;
          this.currentTotalTime = val;
        } else {
          this.lastTotalTime = 0;
          this.currentTotalTime = 0;
        }
        // this.saveTotalTime();
        this.convertTotalTravelTime();
      })
      .catch(() => {});
  }

  public async saveTotalTime(time: number) {
    // this.totalTimerInterval = setInterval(async () => {
    //   this.convertTotalTravelTime();
    //   if (!isNaN(this.lastTotalTime)) {
    //     this.currentTotalTime = this.lastTotalTime + 1;
    //     this.lastTotalTime = this.currentTotalTime;
    //     await this.storage.set(TT_KEY, this.currentTotalTime);
    //   }
    // }, 1000);
    this.convertTotalTravelTime();
    if (!isNaN(this.lastTotalTime)) {
      this.currentTotalTime = this.lastTotalTime + time;
      this.lastTotalTime = this.currentTotalTime;
      await this.storage.set(TT_KEY, this.currentTotalTime);
    }
  }

  public async resetTotalTime() {
    // clearInterval(this.totalTimerInterval);
    await this.storage.remove(TT_KEY);
    this.getTotalTime();
  }
}
