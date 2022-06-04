import { EventEmitter, Injectable, Output } from '@angular/core';
import { speedTime } from 'src/app/common/models/speedTime.model';
import { OdoTripService } from '../odo-trip/odo-trip.service';
import { TimerService } from '../timer/timer.service';
import { TopSpeedService } from '../top-speed/top-speed.service';
import { UnitService } from '../unit/unit.service';

const VALUE: speedTime[] = [];

@Injectable({
  providedIn: 'root',
})
export class CalculateService {
  @Output() calculateData = new EventEmitter();

  public speedo: number;
  public topSpeed: number;
  public accuracy: number;
  public altitude: string;
  public avgSpeed: string;
  public odo: number;
  public trip: string;
  public speedLimit: number;

  private value = [...VALUE];

  constructor(
    private unitService: UnitService,
    private topSpeedService: TopSpeedService,
    private odoTripService: OdoTripService,
    private timerService: TimerService
  ) {}

  public getValue(speed: number, time: number) {
    if (speed == null || time == null) {
      return;
    }

    this.value = [
      ...this.value,
      {
        speed,
        time,
      },
    ];

    let trip = 0;
    for (let i = 0; i < this.value.length; i++) {
      trip = this.value[i].speed * this.value[i].time;
    }

    this.odoTripService.saveOdo(trip);
    this.odoTripService.saveTrip(trip);
  }

  public convert(
    speed: number,
    rawAccuracy: number,
    rawAltitude: number,
    speedLimit: number
  ) {
    switch (this.unitService.unit) {
      case 'metric':
        {
          this.metricUnit(speed, rawAccuracy, rawAltitude);
          this.metricSpeedLimit(speedLimit);
        }
        break;

      case 'imperial':
        {
          this.imperialUnit(speed, rawAccuracy, rawAltitude);
          this.imperialSpeedLimit(speedLimit);
        }
        break;
    }
    this.calculateData.emit();
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
      this.altitude = this.toFixedNoRounding(rawAltitude, 1);
    }

    this.odo = Math.trunc(this.odoTripService.currentOdo / 1000);

    this.trip = this.toFixedNoRounding(
      this.odoTripService.currentTrip / 1000,
      1
    );

    this.avgSpeed =
      this.timerService.currentTotalTime === 0
        ? null
        : this.toFixedNoRounding(
            (this.odoTripService.currentTrip /
              this.timerService.currentTotalTime) *
              3.6,
            1
          );
  }

  private metricSpeedLimit(speedLimit: number) {
    this.speedLimit = Math.trunc(speedLimit * 3.6);
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
      this.altitude = this.toFixedNoRounding(rawAltitude * 3.2808399, 1);
    }

    this.odo = Math.trunc(this.odoTripService.currentOdo * 0.000621371192);

    this.trip = this.toFixedNoRounding(
      this.odoTripService.currentTrip * 0.000621371192,
      1
    );

    this.avgSpeed =
      this.timerService.currentTotalTime === 0
        ? null
        : this.toFixedNoRounding(
            (this.odoTripService.currentTrip /
              this.timerService.currentTotalTime) *
              2.23693629,
            1
          );
  }

  private imperialSpeedLimit(speedLimit: number) {
    if (speedLimit != null) {
      this.speedLimit = Math.trunc(speedLimit * 2.2);
    }
  }

  private toFixedNoRounding(value: number, n: number) {
    const reg = new RegExp('^-?\\d+(?:\\.\\d{0,' + n + '})?', 'g');
    const a = value.toString().match(reg)[0];
    const dot = a.indexOf('.');
    if (dot === -1) {
      // integer, insert decimal dot and pad up zeros
      return a + '.' + '0'.repeat(n);
    }
    const b = n - (a.length - dot) + 1;
    return b > 0 ? a + '0'.repeat(b) : a;
  }
}
