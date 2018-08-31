import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { AmazonFirebaseSupportService } from '../../shared/guard/amazon-firebase-support.service';
import { AppDataService } from '../../services/app-data.service';
import { Login } from './login.interface';
import { LoginService } from './login.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { UtilitiesService } from '../../shared/services/utilities.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService, AmazonFirebaseSupportService]
})
export class LoginComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  private loginResponse: Login;
  private loginFail: Boolean;
  private inValidCredentials: string;
  private loginSubscription: Subscription;
  private loginData: { email: string, password: string };
  constructor(
    private loginService: LoginService,
    private _router: Router,
    private appDataService: AppDataService,
    private amazonFirebaseSupportService: AmazonFirebaseSupportService,
    private utilitiesService: UtilitiesService
  ) { }

  ngOnInit() {
    this.loginFail = false;
    this.inValidCredentials = 'Invalid User!';
    this.appDataService.loginUserData = {};
    this.utilitiesService.deleteCookie('sessionKey');
    this.utilitiesService.deleteCookie('isLoggedIn');
    this.resetLoginData();
  }

  resetLoginData() {
    this.loginData = {
      'email': '',
      'password': ''
    };
  }

  login() {
    this.blockUI.start('Logging In...');
    this.loginFail = false;
    const reqObj = {
      'email': this.loginData.email,
      'password': this.loginData.password
    };
    this.amazonFirebaseSupportService.signInRegular(reqObj.email, reqObj.password)
      .then((sessionKey) => {
        this.utilitiesService.setCookie('sessionKey', sessionKey, 1);
        this.utilitiesService.setCookie('isLoggedIn', true, 1);
        this.loginWithSessionKey(sessionKey, reqObj);
      })
      .catch((err) => console.log(err));
  }

  loginWithSessionKey(sessionKey, reqObj) {
    this.loginSubscription = this.loginService.login(reqObj)
      .subscribe(
        data => {
          if (data.actionStatus === 'SUCCESS') {
            this.loginFail = false;
            this.appDataService.loginUserData = data.apiResult[0];
            this._router.navigate(['']);
          } else if (data.actionStatus === 'FAIL') {
            this.loginFail = true;
            return false;
          }
          this.blockUI.stop();
        },
        error => {
          console.log('Error :: ' + error);
          this.loginFail = true;
          this.blockUI.stop();
          return false;
        }
      );
  }

  ngOnDestroy() {
    if (this.loginSubscription)  { this.loginSubscription.unsubscribe(); }
  }

}
