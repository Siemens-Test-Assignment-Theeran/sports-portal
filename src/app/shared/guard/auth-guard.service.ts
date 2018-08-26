import { HttpClient, HttpClientModule, HttpResponse } from '@angular/common/http';

import { AppDataService } from '../../services/app-data.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RoleMatrix } from '../config-data/role-matrix-constant';
import { Router } from '@angular/router';
import { UtilitiesService } from './../services/utilities.service';

@Injectable()
export class AuthGuardService {
  private rolesMatrix: any;
  private currentRolesMatrix: any;
  private workgroupName: any;
  private roleName: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private utilitiesService: UtilitiesService,
    private appDataService: AppDataService
  ) {
    this.currentRolesMatrix = null;
    this.workgroupName = '';
  }

  checkForAuthentication(authRoute) {
    if ((this.isLoggedIn()) && (this.isValidSession())) {
      this.rolesMatrix = RoleMatrix.roleMatrix;
      return this.rolesMatrix[this.appDataService.loginUserData.role][authRoute];
    } else {
      this.redirectToLoginPage();
      return false;
    }
  }

  isLoggedIn() {
    if (this.utilitiesService.getCookie('isLoggedIn')) {
      return true;
    } else {
      return false;
    }
  }

  isValidSession() {
    if (this.utilitiesService.getCookie('sessionKey') !== 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  redirectToLoginPage() {
    this.utilitiesService.deleteCookie('isLoggedIn');
    this.utilitiesService.deleteCookie('sessionKey');
    this.router.navigate(['/login']);
  }

}
