import { Injectable } from '@angular/core';
import { speedTime } from 'src/app/common/models/speedTime.model';
import { TopSpeedService } from '../top-speed/top-speed.service';
import { UnitService } from '../unit/unit.service';

const VALUE: speedTime[] = [];

const DISTANCCE_DATA: Array<number> = [];

const TIME_DATA: Array<number> = [];

@Injectable({
  providedIn: 'root',
})
export class CalculateService {
  public speedo: number;
  public topSpeed: number;
  public accuracy: number;
  public altitude: string;
  public avgSpeed: string;
  public distance: string;
  public sumDistance: number;
  public sumTime: number;

  private distanceArr = [...DISTANCCE_DATA];
  private timeArr = [...TIME_DATA];
  private value = [...VALUE];

  constructor(
    private unitService: UnitService,
    private topSpeedService: TopSpeedService
  ) {}

  public getValue(speed: number, totalElapsedTime: number) {
    if (speed == null || totalElapsedTime == null) {
      return;
    }

    this.value = [
      ...this.value,
      {
        speed: speed,
        time: totalElapsedTime,
      },
    ];

    for (let i = 0; i < this.value.length; i++) {
      var distance = this.value[i].speed * this.value[i].time;
      var time = this.value[i].time;
    }

    this.timeArr = [...this.timeArr, time];
    this.distanceArr = [...this.distanceArr, distance];

    this.getDistance();
    this.getTime();
  }

  private getTime() {
    this.sumTime = this.timeArr.reduce(
      (partialSum, time) => partialSum + time,
      0
    );
  }

  private getDistance() {
    this.sumDistance = this.distanceArr.reduce(
      (partialSum, a) => partialSum + a,
      0
    );
  }

  public convert(speed: number, rawAccuracy: number, rawAltitude: number) {
    if (this.unitService.unit == 'metric') {
      this.metricUnit(speed, rawAccuracy, rawAltitude);
    } else if (this.unitService.unit == 'imperial') {
      this.imperialUnit(speed, rawAccuracy, rawAltitude);
    }
  }

  private metricUnit(speed: number, rawAccuracy: number, rawAltitude: number) {
    if (speed) {
      this.speedo = Math.round(speed * 3.6);
    }
    this.topSpeed = Math.round(this.topSpeedService.topSpeed * 3.6);
    if (rawAccuracy) {
      this.accuracy = Math.round(rawAccuracy);
    }
    if (rawAltitude) {
      this.altitude = Number(rawAltitude).toFixed(1);
    }
    if (this.sumDistance) {
      this.distance = (this.sumDistance / 1000).toFixed(1);
      if (this.sumTime) {
        this.avgSpeed = ((this.sumDistance / this.sumTime) * 3.6).toFixed(1);
      }
    }
  }

  private imperialUnit(
    speed: number,
    rawAccuracy: number,
    rawAltitude: number
  ) {
    if (speed) {
      this.speedo = Math.round(speed * 2.23693629);
    }
    this.topSpeed = Math.round(this.topSpeedService.topSpeed * 2.23693629);
    if (rawAccuracy) {
      this.accuracy = Math.round(rawAccuracy * 3.2808399);
    }
    if (rawAltitude) {
      this.altitude = Number(rawAltitude * 3.2808399).toFixed(1);
    }
    if (this.sumDistance) {
      this.distance = (this.sumDistance * 0.000621371192).toFixed(1);
      if (this.sumTime) {
        this.avgSpeed = (
          (this.sumDistance / this.sumTime) *
          2.23693629
        ).toFixed(1);
      }
    }
  }
}
