import { Injectable, NgZone } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertComponent } from 'src/app/common/components/alert/alert.component';
import { ToastComponent } from 'src/app/common/components/toast/toast.component';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private alertComponent: AlertComponent,
    private toastComponent: ToastComponent,
    private storage: Storage
  ) {}

  public async getLocalUserData() {
    await this.storage
      .get('user')
      .then(async (val) => {
        if (val) {
          this.userData = JSON.parse(val);
        }
      })
      .catch(() => {});
  }

  public getOnlineUserData() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user.toJSON();
        this.storage.set('user', JSON.stringify(this.userData));
      } else {
        delete this.userData;
        this.storage.remove('user');
      }
    });
  }

  // Log in with email/password
  LogIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user) {
          this.getOnlineUserData();
          this.toastComponent.presentToast(
            'toast.loggedIn',
            null,
            null,
            'success'
          );
        }
      })
      .catch((error) => {
        this.alertComponent.alertWithButton(
          'Failed',
          null,
          error.message,
          null,
          'Ok'
        );
        return false;
      });
  }

  // Log up with email/password
  LogUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
        return true;
      })
      .catch((error) => {
        window.alert(error.message);
        return false;
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    this.storage.get('user').then((val) => {
      const user = JSON.parse(val);
      return user !== null && user.emailVerified !== false;
    });
    return;
  }

  // Log in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      this.router.navigate(['dashboard']);
    });
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.router.navigate(['dashboard']);
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      role: user.role || 'user',
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Log out
  LogOut() {
    return this.afAuth
      .signOut()
      .then(() => {
        this.storage
          .remove('user')
          .then(() =>
            this.toastComponent.presentToast(
              'toast.loggedOut',
              null,
              null,
              'success'
            )
          );
      })
      .catch((err) => {
        this.alertComponent.alertWithButton('error', null, err, null, 'Ok');
      });
  }
}
