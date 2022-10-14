import { EventEmitter, Injectable, Output } from '@angular/core';
import { speedTime } from 'src/app/common/models/speedTime.model';
import { OdoTripService } from '../odo-trip/odo-trip.service';
import { TimerService } from '../timer/timer.service';
import { TopSpeedService } from '../top-speed/top-speed.service';
import { UnitService } from '../unit/unit.service';
import { Storage } from '@ionic/storage-angular';
import { GeolocationService } from '../geolocation/geolocation.service';

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

  private rawSpeed: number;
  private rawAccuracy: number;
  private rawAltitude: number;

  private value = [...VALUE];

  constructor(
    private unitService: UnitService,
    private topSpeedService: TopSpeedService,
    private odoTripService: OdoTripService,
    private timerService: TimerService,
    private storage: Storage,
    private geolocationService: GeolocationService
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

  public getValue() {
    this.geolocationService.geolocationData.subscribe((data) => {
      this.rawSpeed = data.speed;
      this.rawAccuracy = data.rawAccuracy;
      this.rawAltitude = data.rawAltitude;

      this.convert();

      if (this.rawSpeed == null || data.time == null) {
        return;
      }

      this.rawSpeed = this.rawSpeed + this.speedCorrection / 100;

      this.value = [
        ...this.value,
        {
          speed: this.rawSpeed,
          time: data.time,
        },
      ];

      let trip = 0;
      for (const val of this.value) {
        trip = val.speed * val.time;
      }

      this.odoTripService.saveOdo(trip);
      this.odoTripService.saveTrip(trip);
      this.odoTripService.saveAverageSpeedTrip(trip);
    });
  }

  public convert() {
    if (this.rawSpeed != null && this.speedCorrection != null) {
      this.rawSpeed = this.rawSpeed + this.speedCorrection / 100;
    }

    switch (this.unitService.unit) {
      case 'imperial':
        this.imperialUnit();

        break;

      case 'metric':
      default:
        this.metricUnit();
        break;
    }
  }

  // *subscribe unit change
  public changeUnit() {
    this.unitService.unitSystem.subscribe(() => {
      switch (this.unitService.unit) {
        case 'imperial':
          {
            this.imperialUnit();
          }
          break;

        case 'metric':
        default:
          this.metricUnit();
          break;
      }
    });
  }

  // *calculate in metric unit
  private metricUnit() {
    if (this.rawSpeed != null) {
      this.speedo = Math.round(this.rawSpeed * 3.6);
    }

    if (!isNaN(this.topSpeedService.topSpeed)) {
      this.topSpeed = Math.round(this.topSpeedService.topSpeed * 3.6);
    }

    if (this.rawAccuracy != null) {
      this.accuracy = Math.round(this.rawAccuracy);
    }

    if (this.rawAltitude != null) {
      this.altitude = this.toFixedNoRounding(this.rawAltitude, 1);
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

    this.calculateData.emit({
      speedo: this.speedo,
      topSpeed: this.topSpeed,
      accuracy: this.accuracy,
      altitude: this.altitude,
      odo: this.odo,
      trip: this.trip,
      averageSpeed: this.averageSpeed,
    });
  }

  // *calculate in imperial unit
  private imperialUnit() {
    if (this.rawSpeed != null) {
      this.speedo = Math.round(this.rawSpeed * 2.23693629);
    }

    if (!isNaN(this.topSpeedService.topSpeed)) {
      this.topSpeed = Math.round(this.topSpeedService.topSpeed * 2.23693629);
    }

    if (this.rawAccuracy != null) {
      this.accuracy = Math.round(this.rawAccuracy * 3.2808399);
    }

    if (this.rawAltitude != null) {
      this.altitude = this.toFixedNoRounding(this.rawAltitude * 3.2808399, 1);
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

    this.calculateData.emit({
      speedo: this.speedo,
      topSpeed: this.topSpeed,
      accuracy: this.accuracy,
      altitude: this.altitude,
      odo: this.odo,
      trip: this.trip,
      averageSpeed: this.averageSpeed,
    });
  }

  // *fixed number without rounding
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
