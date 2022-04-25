import { EventEmitter, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const TT_KEY = 'total-time';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  public totalTime = new EventEmitter();
  public time = new EventEmitter();
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

      this.time.emit(`${formattedHH}:${formattedMM}:${formattedSS}`);
    }, 1000);
  }

  public stopTimer() {
    this.hiddenStartIcon = !this.hiddenStartIcon;
    clearInterval(this.timerInterval);
  }

  public convertTotalTravelTime() {
    this.totalTime.emit(
      Math.floor(this.currentTotalTime / 3600)
        .toString()
        .padStart(2, '0') +
        ':' +
        (Math.floor(this.currentTotalTime / 60) % 60)
          .toString()
          .padStart(2, '0') +
        ':' +
        (this.currentTotalTime % 60).toString().padStart(2, '0')
    );
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
        this.saveTotalTime();
      })
      .catch(() => {});
  }

  public async saveTotalTime() {
    setInterval(async () => {
      this.convertTotalTravelTime();
      if (!isNaN(this.lastTotalTime)) {
        this.currentTotalTime = this.lastTotalTime + 1;
        this.lastTotalTime = this.currentTotalTime;
        await this.storage.set(TT_KEY, this.currentTotalTime);
      }
    }, 1000);
  }
}
