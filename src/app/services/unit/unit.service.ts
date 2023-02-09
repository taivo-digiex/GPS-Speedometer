import { EventEmitter, Injectable, Output } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import AppConstant from 'src/app/utilities/app-constant';

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
        this.saveUnit(AppConstant.unitSystem.metric.unit);
      }
    });
  }

  public async saveUnit(unit: string) {
    this.unit = unit;
    await this.storage.set(UNIT_KEY, unit).then(() => this.convertUnit());
  }

  public convertUnit() {
    switch (this.unit) {
      case AppConstant.unitSystem.imperial.unit:
        this.speedUnit = AppConstant.unitSystem.imperial.speedUnit;
        this.distanceUnit = AppConstant.unitSystem.imperial.mileUnit;
        this.lengthUnit = AppConstant.unitSystem.imperial.feetUnit;
        break;

      default:
        this.speedUnit = AppConstant.unitSystem.metric.speedUnit;
        this.distanceUnit = AppConstant.unitSystem.metric.kilometerUnit;
        this.lengthUnit = AppConstant.unitSystem.metric.meterUnit;
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
