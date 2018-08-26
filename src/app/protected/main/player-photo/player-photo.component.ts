import { Component, Input, OnInit } from '@angular/core';

import { Player } from '../main.interface';

@Component({
  selector: 'app-player-photo',
  templateUrl: './player-photo.component.html',
  styleUrls: ['./player-photo.component.css']
})
export class PlayerPhotoComponent implements OnInit {
  @Input('selectedPlayer') selectedPlayer: string;
  private playerImg: string;
  private playerSelected: boolean;
  constructor() { }

  ngOnInit() {
    this.playerImg = '';
    this.playerSelected = false;
  }

}
