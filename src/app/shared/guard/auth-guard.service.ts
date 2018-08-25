import { HttpClient, HttpClientModule, HttpResponse } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RoleMatrix } from '../config-data/role-matrix-constant';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuardService {
  private rolesMatrix: any;
  private currentRolesMatrix: any;
  private workgroupName: any;
  private roleName: any;
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentRolesMatrix = null;
    this.workgroupName = '';
  }

  checkForAuthentication(authRoute) {
    let result = false;
    if ((this.isLoggedIn()) && (this.isValidSession())) {
      this.rolesMatrix = RoleMatrix.roleMatrix;
      this.checkIsUserWorkGroupChanged(authRoute);
      result = this.checkIsAuthenticatedForPage(authRoute);
      return result;
    } else {
      this.redirectToLoginPage();
      return false;
    }
  }

  checkIsUserWorkGroupChanged(authRoute) {
    let result = false;
    if ((this.workgroupName !== sessionStorage.getItem('workGroups')) || (this.roleName !== sessionStorage.getItem('roleName'))) {
      result = this.getCurrentRoleMatrix(authRoute);
    }
  }

  checkIsAuthenticatedForPage(authRoute) {
    if (this.currentRolesMatrix) {
      if (this.currentRolesMatrix[authRoute]) {
        return true;
      } else {
        this.redirectToAuthenticatedPage();
        return false;
      }
    } else {
      return this.getCurrentRoleMatrix(authRoute);
    }
  }

  getCurrentRoleMatrix(authRoute) {
    let result: object, loggedUserWorkGroupsArray: any[];
    loggedUserWorkGroupsArray = [];
    this.workgroupName = sessionStorage.getItem('workGroups');
    this.roleName = sessionStorage.getItem('roleName');
    const loggedUserWorkGroups = sessionStorage.getItem('workGroups');
    loggedUserWorkGroupsArray = loggedUserWorkGroups.split(',');
    if (loggedUserWorkGroupsArray.length > 0) {
      result = this.getIntialRoleMatrix(loggedUserWorkGroupsArray);
    } else {
      result = this.rolesMatrix[loggedUserWorkGroupsArray[0]];
    }

    if (sessionStorage.getItem('roleName') === 'Administrator') {
      result = this.rolesMatrix['Administrator'];
    }

    this.currentRolesMatrix = JSON.parse(JSON.stringify(result));
    if (this.currentRolesMatrix[authRoute]) {
      return true;
    } else {
      this.redirectToAuthenticatedPage();
      return false;
    }
  }

  getIntialRoleMatrix(loggedUserWorkGroupsArray) {
    let result: object;
    this.rolesMatrix = RoleMatrix.roleMatrix;
    const roleMatrixKeys = Object.keys(this.rolesMatrix['Administrator']);
    result = {};
    for (let i = 0; i < roleMatrixKeys.length; i++) {
      result[roleMatrixKeys[i]] = this.getFinalRoleMatrixObject(loggedUserWorkGroupsArray, roleMatrixKeys[i]);
    }
    return result;
  }

  getFinalRoleMatrixObject(loggedUserWorkGroupsArray, roleMatrixKey) {
    let result = false;
    for (let i = 0; i < loggedUserWorkGroupsArray.length; i++) {
      if (this.rolesMatrix[loggedUserWorkGroupsArray[i]][roleMatrixKey]) {
        result = true;
        break;
      }
    }
    return result;
  }

  isLoggedIn() {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
      return true;
    } else {
      return false;
    }
  }

  isValidSession() {
    if (typeof sessionStorage.getItem('sessionKey') !== 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  redirectToAuthenticatedPage() {
    const workGroups = sessionStorage.getItem('workGroups').split(',');
    if (workGroups.length > 0) {
      this.router.navigate(['']);
    } else if (workGroups[0] === 'requestor') {
      this.router.navigate(['plm-work-flow/requestor/intake-request-list']);
    } else if (workGroups[0] === 'configurator') {
      this.router.navigate(['plm-work-flow/configurator/offer/project-list']);
    }
  }

  redirectToLoginPage() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('sessionKey');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('roleName');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('workGroups');
    this.router.navigate(['/login']);
  }

}
