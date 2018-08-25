import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, } from '@angular/router';

import { AuthGuardService } from './auth-guard.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authGuardService: AuthGuardService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    const path = next.data['path'] as string;
    return this.authGuardService.checkForAuthentication(path);
  }
}
