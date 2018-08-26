import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { AppDataService } from './../../../services/app-data.service';
import { MainService } from './../services/main.service';
import { Player } from '../main.interface';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css']
})
export class PlayerDetailComponent implements OnInit, OnDestroy {
  @Input('selectedPlayer') selectedPlayer: Player;
  @Input('playersList') playersList: Player[];
  @Output('openAddEdit') openAddEdit = new EventEmitter<string>();
  private isAdmin: boolean;
  private playerDeleted: boolean;
  private editPlayerSubscription: Subscription;
  constructor(private appDataService: AppDataService, private mainService: MainService) { }

  ngOnInit() {
    this.playerDeleted = false;
    if (this.appDataService.loginUserData) {
      this.isAdmin = (this.appDataService.loginUserData.role === 'admin') ? true : false;
    }
  }

  moveToAddEditPlayer(mode) {
    this.openAddEdit.emit(mode);
  }

  deletePlayer() {
    this.updatePlayerList(this.selectedPlayer);
    this.editPlayerSubscription = this.mainService.editPlayer(this.playersList).subscribe(
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
  updatePlayerList(addPlayerObj) {
    const result = [];
    this.playersList.map((value, index) => {
      if (value.id !== addPlayerObj.id) {
        result.push(this.playersList[index]);
      }
    });
    this.playersList = result;
  }

  ngOnDestroy() {
    if (this.editPlayerSubscription) {
      this.editPlayerSubscription.unsubscribe();
    }
  }

}
