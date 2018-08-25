import { Inject, Injectable, OnInit } from '@angular/core';

import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class AppConfigService implements OnInit {
  public url: string;
  public urlConstants: any;
  constructor(@Inject(DOCUMENT) private document) {
      //  this.url = 'https://plm-services.dev.cox.com';
      this.url = 'https://sports-portal-3888c.firebaseio.com/';
      this.urlConstants = {
        // "PLM_LOGIN_RESPONSE": 'plm-engine/login/v0/users/authenticate',
        // "PLM_LOGIN_RESPONSE": 'data/login/Login_Response.json',
        'SPORTS_PORTAL_LOGIN_API': 'users.json',
        'FETCH_ALL_PLAYERS': 'players.json',
        'SPORTS_PORTAL_LOGOUT_API': ''
      };
  }

  ngOnInit() {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
  }

}
