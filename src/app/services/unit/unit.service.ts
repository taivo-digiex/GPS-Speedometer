import { EventEmitter, Injectable, Output } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const UNIT_KEY = 'unit';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  @Output() unitSystem = new EventEmitter();
  public unit: string;
  public lenghtUnit: string;
  public speedUnit: string;
  public distanceUnit: string;

  constructor(private storage: Storage) {}

  public async getUnit() {
    await this.storage.get(UNIT_KEY).then((val) => {
      if (val) {
        this.saveUnit(val);
      } else {
        this.saveUnit('metric');
      }
    });
  }

  public async saveUnit(unit: string) {
    this.unit = unit;
    await this.storage.set(UNIT_KEY, unit);
    this.convertUnit();
  }

  public convertUnit() {
    switch (this.unit) {
      case 'imperial':
        this.speedUnit = 'mph';
        this.distanceUnit = 'mi';
        this.lenghtUnit = 'ft';
        break;

      case 'metric':
        this.speedUnit = 'km/h';
        this.distanceUnit = 'km';
        this.lenghtUnit = 'm';
        break;
    }
    this.unitSystem.emit();
  }

  public getUnits() {
    return [{ value: 'metric' }, { value: 'imperial' }];
  }
}
