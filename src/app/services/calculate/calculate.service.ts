import { Injectable } from '@angular/core';
import { speedTime } from 'src/app/common/models/speedTime.model';
import { OdoTripService } from '../odo-trip/odo-trip.service';
import { TimerService } from '../timer/timer.service';
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
  public odo: string;
  public trip: string;

  private odoArr = [...DISTANCCE_DATA];
  private tripArr = [...DISTANCCE_DATA];
  private timeArr = [...TIME_DATA];
  private value = [...VALUE];

  constructor(
    private unitService: UnitService,
    private topSpeedService: TopSpeedService,
    private odoTripService: OdoTripService,
    private timerService: TimerService
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
      var trip = this.value[i].speed * this.value[i].time;
      var time = this.value[i].time;
    }

    this.timeArr = [...this.timeArr, time];
    this.odoArr = [...this.tripArr, trip];
    this.tripArr = [...this.tripArr, trip];

    this.getOdoTrip();
    this.getTime();
  }

  private getTime() {
    this.timerService.saveTotalTime(
      this.timeArr.reduce((partialSum, time) => partialSum + time, 0)
    );
  }

  private getOdoTrip() {
    this.odoTripService.saveOdo(
      this.odoArr.reduce((partialSum, a) => partialSum + a, 0)
    );
    this.odoTripService.saveTrip(
      this.tripArr.reduce((partialSum, a) => partialSum + a, 0)
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
    if (speed != null) {
      this.speedo = Math.round(speed * 3.6);
    }
    this.topSpeed = Math.round(this.topSpeedService.topSpeed * 3.6);
    if (rawAccuracy != null) {
      this.accuracy = Math.round(rawAccuracy);
    }
    if (rawAltitude != null) {
      this.altitude = Number(rawAltitude).toFixed(1);
    }
    this.odo = (this.odoTripService.currentOdo / 1000).toFixed(1);
    this.trip = (this.odoTripService.currentTrip / 1000).toFixed(1);
    if (this.timerService.currentTotalTime != 0) {
      this.avgSpeed = (
        (this.odoTripService.currentOdo / this.timerService.currentTotalTime) *
        3.6
      ).toFixed(1);
    }
  }

  private imperialUnit(
    speed: number,
    rawAccuracy: number,
    rawAltitude: number
  ) {
    if (speed != null) {
      this.speedo = Math.round(speed * 2.23693629);
    }
    this.topSpeed = Math.round(this.topSpeedService.topSpeed * 2.23693629);
    if (rawAccuracy != null) {
      this.accuracy = Math.round(rawAccuracy * 3.2808399);
    }
    if (rawAltitude != null) {
      this.altitude = Number(rawAltitude * 3.2808399).toFixed(1);
    }
    this.odo = (this.odoTripService.currentOdo * 0.000621371192).toFixed(1);
    this.trip = (this.odoTripService.currentTrip * 0.000621371192).toFixed(1);
    if (this.timerService.currentTotalTime != 0) {
      this.avgSpeed = (
        (this.odoTripService.currentOdo / this.timerService.currentTotalTime) *
        2.23693629
      ).toFixed(1);
    }
  }
}
