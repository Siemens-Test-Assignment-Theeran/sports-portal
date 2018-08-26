import 'firebase/storage';

import * as firebase from 'firebase/app';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { AngularFireAuth } from 'angularfire2/auth';
import { AppDataService } from '../../services/app-data.service';
import { FileUpload } from './fileupload';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AmazonFirebaseSupportService {
  private user: Observable<firebase.User>;
  private basePath = '/uploads';
  constructor(
    private _firebaseAuth: AngularFireAuth, 
    private _db: AngularFireDatabase, 
    private router: Router, 
    private appDataService: AppDataService
  ) {
    this.user = _firebaseAuth.authState;

  }

  signInRegular(email, password) {
    this._firebaseAuth.auth.setPersistence(firebase.auth.Auth.Persistence.NONE);
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password).then((res) => {
      return res.user.getIdToken().then((idToken) => {
        return idToken;
      })
        .catch((err) => console.log('error: ' + err));
      // this.router.navigate(['dashboard']);
    })
      .catch((err) => console.log('error: ' + err));
  }

  signOUt() {
    this._firebaseAuth.auth.signOut().then((res) => {
    })
      .catch((err) => console.log('error: ' + err));
  }

  pushFileToStorageAndDB(formData: Object, fileUpload: FileUpload, progress: { percentage: number }) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${fileUpload.file.name}`).put(fileUpload.file);
    const result = {};
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // in progress
        const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      },
      (error) => {
        // fail
        console.log(error);
      },
      () => {
        // success
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          this.appDataService.modifyFileUploaded(fileUpload);
        });
      }
    );
  }

  private saveFileData(fileUpload: FileUpload) {
    this._db.list(`${this.basePath}/`).push(fileUpload);
  }

  getFileUploads(numberItems): AngularFireList<FileUpload> {
    return this._db.list(this.basePath, ref =>
      ref.limitToLast(numberItems));
  }

  deleteFileUpload(fileUpload: FileUpload) {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch(error => console.log(error));
  }

  private deleteFileDatabase(key: string) {
    return this._db.list(`${this.basePath}/`).remove(key);
  }

  private deleteFileStorage(name: string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete();
  }

  addItemToDB(tableName, objToAdd) {
    const tableList = this._db.list(tableName);
    tableList.push(objToAdd);
  }

  updateItemToDB(tableName, value, key) {
    const tableList = this._db.list(tableName);
    tableList.update(key, value).catch(error => this.handleError(error));
  }

  deleteItemToDB(tableName, key): void {
    const tableList = this._db.list(tableName);
    tableList.remove(key).catch(error => this.handleError(error));
  }

  private handleError(error) {
    console.log(error);
  }

}
