import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storageObserver: any;
  public storageObservable: any;

  constructor(private storage: Storage) {
    this.storageObservable = new Observable((observer: Observer<number>) => {
      this.storageObserver = observer;
    });
  }

  public async getStorageValue(storageKey: string) {
    return await this.storage
      .get(storageKey)
      .then((val) => {
        this.storageObserver.next(val);
      })
      .catch(() => {});
  }
}
