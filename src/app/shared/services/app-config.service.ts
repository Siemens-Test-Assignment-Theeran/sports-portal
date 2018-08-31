import { Inject, Injectable, OnInit } from '@angular/core';

import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class AppConfigService implements OnInit {
  public url: string;
  public urlConstants: any;
  constructor(@Inject(DOCUMENT) private document) {
      this.url = 'https://sports-portal-3888c.firebaseio.com';
      this.urlConstants = {
        'SPORTS_PORTAL_LOGIN_API': 'users.json',
        'FETCH_ALL_PLAYERS': 'players.json'
      };
  }

  ngOnInit() {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
  }

}
