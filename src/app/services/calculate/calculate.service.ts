import { EventEmitter, Injectable, Output } from '@angular/core';
import { speedTime } from 'src/app/common/models/speedTime.model';
import AppConstant from 'src/app/utilities/app-constant';
import AppUtil from 'src/app/utilities/app-util';
import { OdoTripService } from '../odo-trip/odo-trip.service';
import { TimerService } from '../timer/timer.service';
import { TopSpeedService } from '../top-speed/top-speed.service';
import { Storage } from '@ionic/storage-angular';
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
  public adjustSpeed: number;

  private value = [...VALUE];

  constructor(
    private unitService: UnitService,
    private topSpeedService: TopSpeedService,
    private odoTripService: OdoTripService,
    private timerService: TimerService,
    private storage: Storage
  ) {}

  public async getAdjustSpeed() {
    await this.storage
      .get(AppConstant.STORAGE_KEYS.ADJUST_SPEED)
      .then((val) => {
        if (val) {
          this.adjustSpeed = val;
        } else {
          this.adjustSpeed = 0;
          this.setAdjustSpeed(0);
        }
      })
      .catch(() => {});
  }

  public async setAdjustSpeed(value: number) {
    this.adjustSpeed = value / 3.6;
    await this.storage.set(AppConstant.STORAGE_KEYS.ADJUST_SPEED, value / 3.6);
  }

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
    for (const val of this.value) {
      if (speed > this.adjustSpeed) {
        trip = (val.speed + this.adjustSpeed) * val.time;
      } else {
        trip = val.speed * val.time;
      }
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
      if (speed > this.adjustSpeed) {
        this.speedo = Math.round((speed + this.adjustSpeed) * 3.6);
      } else {
        this.speedo = Math.round(speed * 3.6);
      }
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

    if (this.timerService.currentTotalTime > 0) {
      this.avgSpeed = AppUtil.toFixedNoRounding(
        (this.odoTripService.currentTrip / this.timerService.currentTotalTime) *
          3.6,
        1
      );
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
      this.altitude = AppUtil.toFixedNoRounding(rawAltitude * 3.2808399, 1);
    }

    this.odo = Math.trunc(this.odoTripService.currentOdo * 0.000621371192);

    this.trip = AppUtil.toFixedNoRounding(
      this.odoTripService.currentTrip * 0.000621371192,
      1
    );

    if (this.timerService.currentTotalTime > 0) {
      this.avgSpeed = AppUtil.toFixedNoRounding(
        (this.odoTripService.currentTrip / this.timerService.currentTotalTime) *
          2.23693629,
        1
      );
    }
  }
}
