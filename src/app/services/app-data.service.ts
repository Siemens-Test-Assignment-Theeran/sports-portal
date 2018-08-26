import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  public loginUserData: any;
  public isContextMenuOpened: boolean;
  public contextMenuSelectedPlayer: Subject<any>  = new Subject<any>();
  public selectedPlayer: Subject<any>  = new Subject<any>();
  public fileUploaded: Subject<any>  = new Subject<any>();
  public addEditPlayerCompleted: Subject<any>  = new Subject<any>();
  public contextMenuSelection: string;
  constructor() { }
  public modifySelectedPlayer(value) {
    this.selectedPlayer.next(value);
  }

  public modifyContextMenuSelectedPlayer(value) {
    this.contextMenuSelectedPlayer.next(value);
  }

  public modifyFileUploaded(value) {
    this.fileUploaded.next(value);
  }
  
  public modifyAddEditPlayerCompleted(value) {
    this.addEditPlayerCompleted.next(value);
  }

}
