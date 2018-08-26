import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

import { AppDataService } from '../../../services/app-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-tree',
  templateUrl: './custom-tree.component.html',
  styleUrls: ['./custom-tree.component.css']
})
export class CustomTreeComponent implements OnInit {
  @Input('data') data: Array<Object>;

  constructor(private router: Router, private appDataService: AppDataService) { }

  ngOnInit() {}

  onrightClick(event, data) {
    event.preventDefault();
    this.appDataService.isContextMenuOpened = true;
    this.appDataService.modifyContextMenuSelectedPlayer(data);
  }

  handleListClick(dataObj, event) {
    event.stopPropagation();
    if (dataObj.isHeader) {
      dataObj.isChildVisible = !dataObj.isChildVisible;
    } else {
      this.appDataService.modifySelectedPlayer(dataObj);
    }
  }

}
