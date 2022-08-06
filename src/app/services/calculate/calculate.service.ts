import { EventEmitter, Injectable, Output } from '@angular/core';
import { speedTime } from 'src/app/common/models/speedTime.model';
import AppConstant from 'src/app/utilities/app-constant';
import AppUtil from 'src/app/utilities/app-util';
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

  private value = [...VALUE];

  constructor(
    private unitService: UnitService,
    private topSpeedService: TopSpeedService,
    private odoTripService: OdoTripService,
    private timerService: TimerService
  ) {}

  public getValue(speed: number, time: number) {
    if (speed > 0 || time == null) {
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
    for (const val of this.value) {
      trip = val.speed * val.time;
    }

    this.odoTripService.saveOdo(trip);
    this.odoTripService.saveTrip(trip);
  }

  public convert(speed: number, rawAccuracy: number, rawAltitude: number) {
    switch (this.unitService.unit) {
      case AppConstant.UNIT_SYSTEM.METRIC.UNIT:
        {
          this.metricUnit(speed, rawAccuracy, rawAltitude);
        }
        break;

      case AppConstant.UNIT_SYSTEM.IMPERIAL.UNIT:
        {
          this.imperialUnit(speed, rawAccuracy, rawAltitude);
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
      this.altitude = AppUtil.toFixedNoRounding(rawAltitude, 1);
    }

    this.odo = Math.trunc(this.odoTripService.currentOdo / 1000);

    this.trip = AppUtil.toFixedNoRounding(
      this.odoTripService.currentTrip / 1000,
      1
    );

    this.avgSpeed =
      this.timerService.currentTotalTime === 0
        ? null
        : AppUtil.toFixedNoRounding(
            (this.odoTripService.currentTrip /
              this.timerService.currentTotalTime) *
              3.6,
            1
          );
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
      this.altitude = AppUtil.toFixedNoRounding(rawAltitude * 3.2808399, 1);
    }

    this.odo = Math.trunc(this.odoTripService.currentOdo * 0.000621371192);

    this.trip = AppUtil.toFixedNoRounding(
      this.odoTripService.currentTrip * 0.000621371192,
      1
    );

    this.avgSpeed =
      this.timerService.currentTotalTime === 0
        ? null
        : AppUtil.toFixedNoRounding(
            (this.odoTripService.currentTrip /
              this.timerService.currentTotalTime) *
              2.23693629,
            1
          );
  }
}
