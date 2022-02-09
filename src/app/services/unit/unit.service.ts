import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { MaxSpeedService } from '../max-speed/max-speed.service';

const UNIT_KEY = 'selected-unit';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  public speedo: number;
  public maxSpeed: number;
  public accuracy: number;
  public altitude: string;
  public unit: string;
  public lenghtUnit: string;
  public speedUnit: string;

  constructor(
    private storage: Storage,
    private maxSpeedService: MaxSpeedService
  ) {}

  public setDefaultUnit() {
    this.storage.get(UNIT_KEY).then((val) => {
      if (val) {
        this.saveUnit(val);
        this.unit = val;
      } else {
        this.saveUnit('metric');
        this.unit = this.unit;
      }
    });
  }

  public saveUnit(unit: string) {
    this.unit = unit;
    this.storage.set(UNIT_KEY, unit);
  }

  public convertUnit(speed: number, rawAccuracy: number, rawAltitude: number) {
    if (this.unit == 'metric') {
      this.speedo = Math.round(speed * 3.6);
      this.maxSpeed = Math.round(this.maxSpeedService.maxSpeed * 3.6);
      this.accuracy = Math.round(rawAccuracy);
      this.altitude = Number(rawAltitude).toFixed(1);

      this.speedUnit = 'km/h';
      this.lenghtUnit = 'm';
    } else if (this.unit == 'imperial') {
      this.speedo = Math.round(speed * 2.23693629);
      this.maxSpeed = Math.round(this.maxSpeedService.maxSpeed * 2.23693629);
      this.accuracy = Math.round(rawAccuracy * 3.2808399);
      this.altitude = Number(rawAltitude * 3.2808399).toFixed(1);

      this.speedUnit = 'mph';
      this.lenghtUnit = 'ft';
    }
  }
}
