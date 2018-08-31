import { Component, Input, OnInit } from '@angular/core';

import { AppDataService } from '../../../services/app-data.service';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit {
  @Input() x = 0;
  @Input() y = 0;
  @Input('contextmenu') contextmenu: boolean;
  constructor(private appDataService: AppDataService) { }

  ngOnInit() { }

  openPlayer() {
    this.appDataService.contextMenuSelection = 'open';
    this.appDataService.modifyContextMenuSelectedPlayer(this.appDataService.selectedPlayer);
    this.contextmenu = false;
  }

  deletePlayer() {
    this.appDataService.contextMenuSelection = 'delete';
    this.appDataService.modifyContextMenuSelectedPlayer(this.appDataService.selectedPlayer);
  }
}
