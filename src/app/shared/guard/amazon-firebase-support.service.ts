import * as firebase from 'firebase/app';

import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AmazonFirebaseSupportService {
  private user: Observable<firebase.User>;
  constructor(private _firebaseAuth: AngularFireAuth, private router: Router) {
    this.user = _firebaseAuth.authState;
  }

  signInRegular(email, password) {
    this._firebaseAuth.auth.setPersistence(firebase.auth.Auth.Persistence.NONE);
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password).then((res) => {
      console.log(res);
      return res.user.getIdToken().then((idToken) => {
        console.log(idToken);
        return idToken;
      })
      .catch((err) => console.log('error: ' + err));
      // this.router.navigate(['dashboard']);
    })
    .catch((err) => console.log('error: ' + err));
  }

  signOUt() {
    this._firebaseAuth.auth.signOut().then((res) => {
      console.log(res);
    })
    .catch((err) => console.log('error: ' + err));
  }
}
