import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const TT_KEY = 'total-time';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  public time: string = '00:00:00';
  public totalElapsedTimeInterval: any;
  public totalElapsedTime: number;
  public timerInterval: any;
  public hiddenStartIcon: boolean = false;
  public currentTotalTime: number;
  public lastTotalTime: number;

  constructor(private storage: Storage) {}

  public calculateTime() {
    let startTime: number;
    let elapsedTime: number = 0;
    startTime = Date.now() - elapsedTime;

    this.totalElapsedTimeInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;

      let diffInHrs = elapsedTime / 3600000;
      let hh = Math.floor(diffInHrs);

      let diffInMin = (diffInHrs - hh) * 60;
      let mm = Math.floor(diffInMin);

      let diffInSec = (diffInMin - mm) * 60;
      let ss = Math.floor(diffInSec);

      this.totalElapsedTime = hh * 3600000 + mm * 60 + ss;
    }, 1000);
  }

  public stopTotalElapsedTime() {
    clearInterval(this.totalElapsedTimeInterval);
    this.calculateTime();
  }

  public timer() {
    let startTime: number;
    let elapsedTime: number = 0;
    startTime = Date.now() - elapsedTime;
    this.hiddenStartIcon = !this.hiddenStartIcon;

    this.timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;

      let diffInHrs = elapsedTime / 3600000;
      let hh = Math.floor(diffInHrs);

      let diffInMin = (diffInHrs - hh) * 60;
      let mm = Math.floor(diffInMin);

      let diffInSec = (diffInMin - mm) * 60;
      let ss = Math.floor(diffInSec);

      let formattedHH = hh.toString().padStart(2, '0');
      let formattedMM = mm.toString().padStart(2, '0');
      let formattedSS = ss.toString().padStart(2, '0');

      this.time = `${formattedHH}:${formattedMM}:${formattedSS}`;
    }, 1000);
  }

  public stopTimer() {
    this.hiddenStartIcon = !this.hiddenStartIcon;
    clearInterval(this.timerInterval);
  }

  public async getTotalTime() {
    await this.storage
      .get(TT_KEY)
      .then((val) => {
        if (val) {
          this.lastTotalTime = 0;
          this.currentTotalTime = val;
          this.saveTotalTime(val);
        } else {
          this.lastTotalTime = 0;
          this.currentTotalTime = 0;
          this.saveTotalTime(0);
        }

        setInterval(() => {
          this.saveTotalTime(1);
        }, 1000);
      })
      .catch(() => {});
  }

  public async saveTotalTime(time: number) {
    if (!isNaN(time) && !isNaN(this.lastTotalTime)) {
      this.currentTotalTime = this.lastTotalTime + time;
      this.lastTotalTime = this.currentTotalTime;
      await this.storage.set(TT_KEY, this.currentTotalTime);
    }
  }
}
