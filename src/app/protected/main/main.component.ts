import { Component, OnDestroy, OnInit } from '@angular/core';

import { AppDataService } from '../../services/app-data.service';
import { MainDataService } from './services/main-data.service';
import { MainService } from './services/main.service';
import { Player } from './main.interface';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { UtilitiesService } from '../../shared/services/utilities.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [MainService, UtilitiesService]
})
export class MainComponent implements OnInit, OnDestroy {
  private showAddEditPane: boolean;
  private playersData: Player[];
  private groupBy: string;
  private fetchPlayerFail: boolean;
  private selectedPlayer: Player;
  private addEditMode: boolean;
  private showPanes: boolean;
  private playerDeleted: boolean;
  private selectedPlayerSubscription: Subscription;
  private contextMenuSelectSubscription: Subscription;
  private addEditCompleteSubscription: Subscription;
  private getPlayerDetailsSubscription: Subscription;
  private fetchAllPlayersSubscription: Subscription;
  private editPlayerSubscription: Subscription;
  constructor(
    private mainService: MainService, 
    private appDataService: AppDataService, 
    private utilitiesService: UtilitiesService, 
    private router: Router
  ) { }

  ngOnInit() {
    this.initialize();
    this.selectedPlayerSubscription = this.appDataService.selectedPlayer.subscribe(
      (playerObj) => {
        if (!this.appDataService.isContextMenuOpened) {
          this.updatePlayerDetails(playerObj);
          this.showAddEditPane = false;
        }
      }
    );
    this.contextMenuSelectSubscription = this.appDataService.contextMenuSelectedPlayer.subscribe(
      (playerObj) => {
        this.updatePlayerDetails(playerObj);
        if (this.appDataService.contextMenuSelection === 'delete') {
          this.deletePlayer();
        }
        this.appDataService.isContextMenuOpened = false;
        this.showAddEditPane = false;
      }
    );
    this.addEditCompleteSubscription = this.appDataService.addEditPlayerCompleted.subscribe(
      (savedPlayerInfo) => {
        this.initialize();
      }
    );
  }

  initialize() {
    this.playerDeleted = false;
    this.showPanes = false;
    this.fetchPlayerFail = false;
    this.showAddEditPane = false;
    this.playersData = [];
    this.selectedPlayer = {
      'id': 0,
      'name': '',
      'country': '',
      'playerRole': '',
      'imageURL': ''
    };
    this.fetchPlayersData();
  }

  updatePlayerDetails(playerObj) {
    this.getPlayerDetailsSubscription = this.mainService.getPlayerDetails(playerObj.id).subscribe(
      data => {
        if (data.actionStatus === 'SUCCESS') {
          this.selectedPlayer = this.getSeletedPlayerDetail(data.apiResult, 'id', playerObj.id)[0];
        } else if (data.actionStatus === 'FAIL') {
          this.fetchPlayerFail = true;
          return false;
        }
      },
      error => {
        console.log('Error :: ' + error);
        this.fetchPlayerFail = true;
        return false;
      }
    );
  }

  fetchPlayersData() {
    this.fetchAllPlayersSubscription = this.mainService.fetchAllPlayers(this.groupBy).subscribe(
      data => {
        this.showPanes = false;
        if (data.actionStatus === 'SUCCESS') {
          this.playersData = data.apiResult;
          this.showPanes = true;
        } else if (data.actionStatus === 'FAIL') {
          this.fetchPlayerFail = true;
          return false;
        }
      },
      error => {
        console.log('Error :: ' + error);
        this.fetchPlayerFail = true;
        return false;
      }
    );
  }

  handleOpenAddEdit(mode) {
    this.showAddEditPane = true;
    this.addEditMode = mode;
  }

  handleCloseAddEdit(mode) {
    this.showAddEditPane = false;
  }

  getSeletedPlayerDetail(dataArray, filterKey, filterValue) {
    return dataArray.filter((value) => {
      return (value[filterKey] === filterValue);
    });
  }

  logout() {
    this.utilitiesService.deleteCookie('sessionKey');
    this.utilitiesService.deleteCookie('isLoggedIn');
    this.router.navigate(['login']);
  }
  
  deletePlayer() {
    this.updatePlayerListData(this.selectedPlayer);
    this.editPlayerSubscription = this.mainService.editPlayer(this.playersData).subscribe(
      data => this.handleSucccess(data),
      error => this.handleFailure(error)
    );
  }

  handleSucccess(dataObj) {
    const data = {
      'actionStatus': 'SUCCESS',
      'actionResult': 'Fetched Result Successfully.',
      'statusCode': 200,
      'apiResult': dataObj
    };
    if (data.actionStatus === 'SUCCESS') {
      this.playerDeleted = false;
      this.appDataService.modifyAddEditPlayerCompleted(data.apiResult);
    } else if (data.actionStatus === 'FAIL') {
      this.playerDeleted = true;
      return false;
    }
  }

  handleFailure(error) {
    console.log('Error :: ' + error);
    this.playerDeleted = true;
    return false;
  }

  // Function to get player list to push to DB.
  // This is dummy function as we will do add/edit/delete in real db.
  // But with firebase iam using the whole json restructing as firebase only supports,
  // json replacement with angular http post/put.
  updatePlayerListData(addPlayerObj) {
    const result = [];
    this.playersData.map((value, index) => {
      if (value.id !== addPlayerObj.id) {
        result.push(this.playersData[index]);
      }
    });
    this.playersData = result;
  }

  ngOnDestroy() {
    if (this.selectedPlayerSubscription)  { this.selectedPlayerSubscription.unsubscribe(); }
    if (this.addEditCompleteSubscription)  { this.addEditCompleteSubscription.unsubscribe(); }
    if (this.contextMenuSelectSubscription)  { this.contextMenuSelectSubscription.unsubscribe(); }
    if (this.editPlayerSubscription)  { this.editPlayerSubscription.unsubscribe(); }
    if (this.fetchAllPlayersSubscription)  { this.fetchAllPlayersSubscription.unsubscribe(); }
    if (this.getPlayerDetailsSubscription)  { this.getPlayerDetailsSubscription.unsubscribe(); }
  }

}