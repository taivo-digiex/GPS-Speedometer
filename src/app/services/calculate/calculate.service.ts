import { EventEmitter, Injectable, Output } from '@angular/core';
import { speedTime } from 'src/app/common/models/speedTime.model';
import { OdoTripService } from '../odo-trip/odo-trip.service';
import { TimerService } from '../timer/timer.service';
import { TopSpeedService } from '../top-speed/top-speed.service';
import { UnitService } from '../unit/unit.service';
import { Storage } from '@ionic/storage-angular';

const VALUE: speedTime[] = [];
const ADJUST_SPEED = 'speedCorrection';

@Injectable({
  providedIn: 'root',
})
export class CalculateService {
  @Output() calculateData = new EventEmitter();

  public speedo: number;
  public topSpeed: number;
  public accuracy: number;
  public altitude: string;
  public averageSpeed: string;
  public odo: number;
  public trip: string;
  public speedCorrection: number;

  private value = [...VALUE];

  constructor(
    private unitService: UnitService,
    private topSpeedService: TopSpeedService,
    private odoTripService: OdoTripService,
    private timerService: TimerService,
    private storage: Storage
  ) {}

  public async getSpeedCorrection() {
    await this.storage
      .get(ADJUST_SPEED)
      .then((val) => {
        if (val) {
          this.speedCorrection = val;
        } else {
          this.speedCorrection = 0;
          this.setSpeedCorrection(0);
        }
      })
      .catch(() => {});
  }

  public async setSpeedCorrection(value: number) {
    this.speedCorrection = value;
    await this.storage.set(ADJUST_SPEED, value);
  }

  public getValue(speed: number, time: number) {
    if (speed == null || time == null) {
      return;
    }

    speed = speed + this.speedCorrection / 100;

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
    this.odoTripService.saveAverageSpeedTrip(trip);
  }

  public convert(speed: number, rawAccuracy: number, rawAltitude: number) {
    if (speed != null && this.speedCorrection != null) {
      speed = speed + this.speedCorrection / 100;
    }

    switch (this.unitService.unit) {
      case 'imperial':
        {
          this.imperialUnit(speed, rawAccuracy, rawAltitude);
        }
        break;
      default: {
        this.metricUnit(speed, rawAccuracy, rawAltitude);
      }
    }
    this.calculateData.emit();
  }

  private metricUnit(speed: number, rawAccuracy: number, rawAltitude: number) {
    if (speed != null) {
      this.speedo = Math.round(speed * 3.6);
    }

    if (!isNaN(this.topSpeedService.topSpeed)) {
      this.topSpeed = Math.round(this.topSpeedService.topSpeed * 3.6);
    }

    if (rawAccuracy != null) {
      this.accuracy = Math.round(rawAccuracy);
    }

    if (rawAltitude != null) {
      this.altitude = this.toFixedNoRounding(rawAltitude, 1);
    }

    if (!isNaN(this.odoTripService.odo)) {
      this.odo = Math.trunc(this.odoTripService.odo / 1000);
    }

    if (!isNaN(this.odoTripService.trip)) {
      this.trip = this.toFixedNoRounding(this.odoTripService.trip / 1000, 1);
    }

    if (
      !isNaN(this.odoTripService.averageSpeedTrip) &&
      this.timerService.averageSpeedTotalTime > 0
    ) {
      this.averageSpeed = this.toFixedNoRounding(
        (this.odoTripService.averageSpeedTrip /
          this.timerService.averageSpeedTotalTime) *
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

    if (!isNaN(this.topSpeedService.topSpeed)) {
      this.topSpeed = Math.round(this.topSpeedService.topSpeed * 2.23693629);
    }

    if (rawAccuracy != null) {
      this.accuracy = Math.round(rawAccuracy * 3.2808399);
    }

    if (rawAltitude != null) {
      this.altitude = this.toFixedNoRounding(rawAltitude * 3.2808399, 1);
    }

    if (!isNaN(this.odoTripService.odo)) {
      this.odo = Math.trunc(this.odoTripService.odo * 0.000621371192);
    }

    if (!isNaN(this.odoTripService.trip)) {
      this.trip = this.toFixedNoRounding(
        this.odoTripService.trip * 0.000621371192,
        1
      );
    }

    if (
      !isNaN(this.odoTripService.averageSpeedTrip) &&
      this.timerService.averageSpeedTotalTime > 0
    ) {
      this.averageSpeed = this.toFixedNoRounding(
        (this.odoTripService.averageSpeedTrip /
          this.timerService.averageSpeedTotalTime) *
          2.23693629,
        1
      );
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
