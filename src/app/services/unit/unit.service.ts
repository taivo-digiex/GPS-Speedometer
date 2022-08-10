import { EventEmitter, Injectable, Output } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import AppConstant from 'src/app/utilities/app-constant';

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
    await this.storage.get(AppConstant.STORAGE_KEYS.UNIT).then((val) => {
      if (val) {
        this.unit = val;
        this.convertUnit();
      } else {
        this.saveUnit(AppConstant.UNIT_SYSTEM.METRIC.UNIT);
      }
    });
  }

  public async saveUnit(unit: string) {
    this.unit = unit;
    await this.storage.set(AppConstant.STORAGE_KEYS.UNIT, unit);
    this.convertUnit();
  }

  public convertUnit() {
    switch (this.unit) {
      case AppConstant.UNIT_SYSTEM.IMPERIAL.UNIT:
        this.speedUnit = AppConstant.UNIT_SYSTEM.IMPERIAL.SPEED_UNIT;
        this.distanceUnit = AppConstant.UNIT_SYSTEM.IMPERIAL.MILE_UNIT;
        this.lenghtUnit = AppConstant.UNIT_SYSTEM.IMPERIAL.FEET_UNIT;
        break;

      case AppConstant.UNIT_SYSTEM.METRIC.UNIT:
        this.speedUnit = AppConstant.UNIT_SYSTEM.METRIC.SPEED_UNIT;
        this.distanceUnit = AppConstant.UNIT_SYSTEM.METRIC.KM_UNIT;
        this.lenghtUnit = AppConstant.UNIT_SYSTEM.METRIC.METER_UNIT;
        break;
    }
    this.unitSystem.emit();
  }

  public getUnits() {
    return [
      { value: AppConstant.UNIT_SYSTEM.METRIC.UNIT },
      { value: AppConstant.UNIT_SYSTEM.IMPERIAL.UNIT },
    ];
  }
}
