import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const UNIT_KEY = 'selected-unit';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  public unit: string;

  constructor(private storage: Storage) {}

  setDefaultUnit() {
    this.storage.get(UNIT_KEY).then((val) => {
      if (val) {
        this.setUnit(val);
        this.unit = val;
      } else {
        this.setUnit('metric');
        this.unit = this.unit;
      }
    });
  }

  setUnit(unit: string) {
    this.unit = unit;
    this.storage.set(UNIT_KEY, unit);
  }
}
