import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { AppDataService } from '../../../services/app-data.service';
import { MainService } from '../services/main.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit, OnDestroy {
  @ViewChild('playerListContainer') playerListContainer: ElementRef;
  @Input('playersList') playersList: Array<Object>;
  private playersTree: any;
  private groupBy: string;
  private contextmenu = false;
  private contextmenuX = 0;
  private contextmenuY = 0;
  private showContextMenu = false;
  private activeClass: Object;
  private contextMenuSelectSubscription: Subscription;

  private imageMapping = {
    'india': '../../../../assets/india-flag-medium.png',
    'australia': '../../../../assets/australia-flag-medium.png',
    'southafrica': '../../../../assets/south-africa-flag-medium.png',
    'batsman': '../../../../assets/Cricket-Bat-PNG-HD.png',
    'bowler': '../../../../assets/cricket-ball-png-3.png',
    'wicketkeeper': '../../../../assets/keeper-gloves.png',
    'allrounder': '../../../../assets/all-rounder.png'
  };

  constructor(private appDataService: AppDataService, private mainService: MainService) { }

  ngOnInit() {
    this.groupBy = 'country';
    this.showTreeMenu(this.groupBy);
    this.contextMenuSelectSubscription = this.appDataService.contextMenuSelectedPlayer.subscribe(
      (data) => {
        if (data) {
          // const el: HTMLElement = this.playerListContainer.nativeElement as HTMLElement;
          // el.click();
          // this.disableContextMenu();
        }
      }
    );
  }

  resetActiveClass(){
    this.activeClass = {
      'country': '',
      'playerRole': ''
    };
  }

  showTreeMenu(groupBy) {
    this.resetActiveClass();
    this.updateImageUrl();
    this.playersTree = this.getPlayersByGroupBy(this.playersList, groupBy);
    this.activeClass[groupBy] = 'active';
  }

  // In development Application with real DB
  // The following function is not necessary as we make real time queries.
  // Implemented to handle Firebase DB that returns entire json on http request.
  getPlayersByGroupBy(data, groupBy)  {
    const result = data.reduce(function (r, a) {
      r[a[groupBy]] = r[a[groupBy]] || [];
      r[a[groupBy]].push(a);
      return r;
    }, Object.create(null));
    return this.getTreeJSON(result);
  }

  getTreeJSON(jsonData) {
    const result = [];
    for (const key in jsonData) {
      if (jsonData[key].length > 0) {
        const resultObj = {
          'name': key,
          'isHeader': true,
          'isChildVisible': false,
          'players': jsonData[key],
          'srcImg': this.imageMapping[key.split(' ').join('').toLowerCase()]
        };
        result.push(resultObj);
      }
    }
    return result;
  }

  // activates the menu with the coordinates
  onrightClick(event) {
    this.contextmenuX = event.clientX - 70;
    this.contextmenuY = event.clientY - 70;
    this.contextmenu = true;
    this.showContextMenu = (this.appDataService.loginUserData.role === 'admin') ? true : false;
  }

  // disables the menu
  disableContextMenu() {
    this.contextmenu = false;
    this.showContextMenu = false;
  }

  updateImageUrl() {
    const groupByVal = this.groupBy, imageMapping = this.imageMapping;
    this.playersList.map(function(value) {
      if (groupByVal === 'country') {
        value['srcImg'] = imageMapping[value['playerRole'].split(' ').join('').toLowerCase()];
      } else if (groupByVal === 'playerRole') {
        value['srcImg'] = imageMapping[value['country'].split(' ').join('').toLowerCase()];
      }
    });
  }

  ngOnDestroy() {
    if (this.contextMenuSelectSubscription)  { this.contextMenuSelectSubscription.unsubscribe(); }
  }

}
