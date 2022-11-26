import { EventEmitter, Injectable, Output } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const UNIT_KEY = 'unit';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  @Output() unitSystem = new EventEmitter();

  public unit: string;
  public lengthUnit: string;
  public speedUnit: string;
  public distanceUnit: string;

  constructor(private storage: Storage) {}

  public async getUnit() {
    await this.storage.get(UNIT_KEY).then((val) => {
      if (val) {
        this.unit = val;
        this.convertUnit();
      } else {
        this.saveUnit('metric');
      }
    });
  }

  public async saveUnit(unit: string) {
    this.unit = unit;
    await this.storage.set(UNIT_KEY, unit).then(() => this.convertUnit());
  }

  public convertUnit() {
    switch (this.unit) {
      case 'imperial':
        this.speedUnit = 'mph';
        this.distanceUnit = 'mi';
        this.lengthUnit = 'ft';
        break;

      default:
        this.speedUnit = 'km/h';
        this.distanceUnit = 'km';
        this.lengthUnit = 'm';
        break;
    }

    this.unitSystem.emit({
      unit: this.unit,
      speedUnit: this.speedUnit,
      distanceUnit: this.distanceUnit,
      lengthUnit: this.lengthUnit,
    });
  }

  public getUnits() {
    return [{ value: 'metric' }, { value: 'imperial' }];
  }
}
