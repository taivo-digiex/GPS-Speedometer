import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private afs: AngularFirestore) {}

  public getData(collection: string, userId: any) {
    return this.afs
      .collection(collection)
      .doc(userId)
      .valueChanges()
      .pipe(take(1));
  }

  public setData(collection: string, userId: string, params: any) {
    return this.afs
      .collection(collection)
      .doc(userId)
      .set(params, { merge: true })
      .then(() => true);
  }
}
