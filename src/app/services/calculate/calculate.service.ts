import { EventEmitter, Injectable, Output } from '@angular/core';
import { speedTime } from 'src/app/common/models/speedTime.model';
import { OdoTripService } from '../odo-trip/odo-trip.service';
import { TimerService } from '../timer/timer.service';
import { TopSpeedService } from '../top-speed/top-speed.service';
import { UnitService } from '../unit/unit.service';
import { Storage } from '@ionic/storage-angular';
import { GeolocationService } from '../geolocation/geolocation.service';
import { LocalNotifications } from '@capacitor/local-notifications';

const VALUE: speedTime[] = [];
const ADJUST_SPEED = 'speedCorrection';

@Injectable({
  providedIn: 'root',
})
export class CalculateService {
  @Output() calculateData = new EventEmitter();

  private value = [...VALUE];

  public speed: number;
  public topSpeed: number;
  public accuracy: number;
  public odo: number;
  public speedCorrection: number;
  private rawSpeed: number;
  private correctedSpeed: number;
  private rawTopSpeed: number;
  private correctedTopSpeed: number;
  private rawAccuracy: number;
  private rawAltitude: number;

  public trip: string;
  public altitude: string;
  public averageSpeed: string;

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
    await this.storage.set(ADJUST_SPEED, value).then(() => this.convert());
  }

  public getValue() {
    this.geolocationService.geolocationData.subscribe((data) => {
      this.rawSpeed = data.speed;
      this.rawTopSpeed = this.topSpeedService.topSpeed;
      this.rawAccuracy = data.rawAccuracy;
      this.rawAltitude = data.rawAltitude;

      this.convert();

      if (data.time == null) {
        return;
      }

      // if (this.speedCorrection != null) {
      //   this.correctedSpeed =
      //     this.rawSpeed + (this.rawSpeed / 100) * this.speedCorrection;
      // }

      this.value = [
        ...this.value,
        {
          speed: this.correctedSpeed,
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
    if (this.speedCorrection != null) {
      if (this.rawSpeed != null) {
        this.correctedSpeed =
          this.rawSpeed + (this.rawSpeed / 100) * this.speedCorrection;
      }

      if (this.rawTopSpeed != null) {
        this.correctedTopSpeed =
          this.rawTopSpeed + (this.rawTopSpeed / 100) * this.speedCorrection;
      }
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

  // * subscribe unit change
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

  // * calculate in metric unit
  private metricUnit() {
    if (this.correctedSpeed !== undefined) {
      this.speed = Math.round(this.correctedSpeed * 3.6);
    }

    if (this.correctedTopSpeed !== undefined) {
      this.topSpeed = Math.round(this.correctedTopSpeed * 3.6);
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
    } else {
      delete this.averageSpeed;
    }

    LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: new Date().toTimeString(),
          body: `Speed: ${this.speed || 0} ${this.unitService.speedUnit}`,
        },
      ],
    });

    this.calculateData.emit({
      speed: this.speed,
      topSpeed: this.topSpeed,
      accuracy: this.accuracy,
      altitude: this.altitude,
      odo: this.odo,
      trip: this.trip,
      averageSpeed: this.averageSpeed,
    });
  }

  // * calculate in imperial unit
  private imperialUnit() {
    if (this.correctedSpeed !== undefined) {
      this.speed = Math.round(this.correctedSpeed * 2.23693629);
    }

    if (this.correctedTopSpeed !== undefined) {
      this.topSpeed = Math.round(this.correctedTopSpeed * 2.23693629);
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
    } else {
      delete this.averageSpeed;
    }

    LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: new Date().toTimeString(),
          body: `Speed: ${this.speed || 0} ${this.unitService.speedUnit}`,
        },
      ],
    });

    this.calculateData.emit({
      speed: this.speed,
      topSpeed: this.topSpeed,
      accuracy: this.accuracy,
      altitude: this.altitude,
      odo: this.odo,
      trip: this.trip,
      averageSpeed: this.averageSpeed,
    });
  }

  // * fixed number without rounding
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
