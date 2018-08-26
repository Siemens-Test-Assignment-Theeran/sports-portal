import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

import { AmazonFirebaseSupportService } from '../../../shared/guard/amazon-firebase-support.service';
import { AppDataService } from './../../../services/app-data.service';
import { FileUpload } from '../../../shared/guard/fileupload';
import { MainService } from './../services/main.service';
import { NgForm } from '@angular/forms';
import { Player } from '../main.interface';
import { Subscription } from 'rxjs/Subscription';
import { UtilitiesService } from '../../../shared/services/utilities.service';

@Component({
  selector: 'app-add-edit-player',
  templateUrl: './add-edit-player.component.html',
  styleUrls: ['./add-edit-player.component.css'],
  providers: [AmazonFirebaseSupportService]
})
export class AddEditPlayerComponent implements OnInit, OnChanges, OnDestroy {
  @Input('mode') mode: string;
  @Input('selectedPlayer') selectedPlayer: Player;
  @Input('playersList') playersList: Player[];
  @Output('closeAddEdit') closeAddEdit = new EventEmitter<string>();
  private addEditPlayer: Player;
  private addEditPlayerFailed: boolean;
  private fileToUpload: any;
  private fileUploadInfo: any;
  private currentFileUpload: FileUpload;
  private progress: { percentage: number } = { percentage: 0 };
  private fileUploadSubscription: Subscription;
  private addNewPlayerSubscription: Subscription;
  private editPlayerSubscription: Subscription;
  constructor(
    private appDataService: AppDataService,
    private amazonFirebaseSupportService: AmazonFirebaseSupportService,
    private mainService: MainService,
    private utilitiesService: UtilitiesService
  ) { }

  ngOnInit() {
    this.fileToUpload = '';
    this.addEditPlayerFailed = false;
    if (this.mode === 'add') {
      this.addEditPlayer = {
        'id': 0,
        'name': '',
        'country': '',
        'playerRole': '',
        'imageURL': ''
      };
    }
    this.fileUploadSubscription = this.appDataService.fileUploaded.subscribe(
      (fileUploadInfo) => {
        this.fileUploadInfo = fileUploadInfo;
        this.addEditPlayer.imageURL = this.fileUploadInfo.url;
        this.addEditPlayerToDB();
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedPlayer) {
      this.addEditPlayer = this.selectedPlayer;
    }
  }

  updateSubmitData(key, value) {
    this.addEditPlayer[key] = value;
  }

  savePlayer(form: NgForm) {
    this.initializeFileUpload();
  }

  initializeFileUpload() {
    this.amazonFirebaseSupportService.pushFileToStorageAndDB(this.addEditPlayer, this.currentFileUpload, this.progress);
  }

  addEditPlayerToDB() {
    if (this.addEditPlayer.id !== 0) {
      this.updatePlayerList('edit', this.addEditPlayer);
      this.editPlayer();
    } else {
      this.updatePlayerList('add', this.addEditPlayer);
      this.addNewPlayer();
    }
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.currentFileUpload = new FileUpload(this.fileToUpload);
  }

  addNewPlayer() {
    this.addNewPlayerSubscription = this.mainService.addNewPlayer(this.addEditPlayer).subscribe(
      data => this.handleSucccess(data),
      error => this.handleFailure(error)
    );
  }

  returnBack() {
    this.closeAddEdit.emit(true);
  }

  editPlayer() {
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
      this.addEditPlayerFailed = false;
      this.appDataService.modifyAddEditPlayerCompleted(data.apiResult);
    } else if (data.actionStatus === 'FAIL') {
      this.addEditPlayerFailed = true;
      return false;
    }
  }

  handleFailure(error) {
    console.log('Error :: ' + error);
    this.addEditPlayerFailed = true;
    return false;
  }

  // Function to get player list to push to DB.
  // This is dummy function as we will do add/edit/delete in real db.
  // But with firebase iam using the whole json restructing as firebase only supports,
  // json replacement with angular http post/put.
  updatePlayerList(mode, addPlayerObj) {
      if (mode === 'add') {
        addPlayerObj.id = this.playersList.length + 1;
        this.playersList.push(addPlayerObj);
      } else if (mode === 'edit') {
        this.playersList.map((value, index) => {
          if (value.id === addPlayerObj.id) {
            this.playersList[index] = addPlayerObj;
          }
        });
      }
    }

    ngOnDestroy() {
      if (this.fileUploadSubscription)  { this.fileUploadSubscription.unsubscribe(); }
      if (this.addNewPlayerSubscription)  { this.addNewPlayerSubscription.unsubscribe(); }
      if (this.editPlayerSubscription)  { this.editPlayerSubscription.unsubscribe(); }
    }

  }
