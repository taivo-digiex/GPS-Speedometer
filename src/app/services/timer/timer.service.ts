import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  public time: string = '00:00:00';
  public totalElapsedTimeInterval: any;
  public totalElapsedTime: number;
  public timerInterval: any;

  constructor() {}

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
  }

  public timer() {
    let startTime: number;
    let elapsedTime: number = 0;
    startTime = Date.now() - elapsedTime;

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
    clearInterval(this.timerInterval);
    this.time = '00:00:00';
  }
}
