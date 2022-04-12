import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const UNIT_KEY = 'unit';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  public unit: string;
  public lenghtUnit: string;
  public speedUnit: string;
  public distanceUnit: string;

  constructor(private storage: Storage) {}

  public async getUnit() {
    await this.storage.get(UNIT_KEY).then((val) => {
      if (val) {
        this.unit = val;
        this.saveUnit(val);
      } else {
        this.unit = 'metric';
        this.saveUnit('metric');
      }
    });
  }

  public async saveUnit(unit: string) {
    this.unit = unit;
    await this.storage.set(UNIT_KEY, unit);
  }

  public convertUnit() {
    if (this.unit == 'metric') {
      this.speedUnit = 'km/h';
      this.distanceUnit = 'km';
      this.lenghtUnit = 'm';
    } else if (this.unit == 'imperial') {
      this.speedUnit = 'mph';
      this.distanceUnit = 'mi';
      this.lenghtUnit = 'ft';
    }
  }

  public getUnits() {
    return [{ value: 'metric' }, { value: 'imperial' }];
  }
}
