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
  @Input('groupBy') groupBy: string;
  constructor(private router: Router, private appDataService: AppDataService) { }

  ngOnInit() {}

  onrightClick(event, data) {
    if (!data.isHeader) {
      this.appDataService.isContextMenuOpened = true;
      this.appDataService.selectedPlayer = data;
    }
  }

  handleListClick(dataObj, event) {
    if (dataObj.isHeader) {
      dataObj.isChildVisible = !dataObj.isChildVisible;
    } else {
      console.log(dataObj);
      this.appDataService.modifySelectedPlayer(dataObj);
    }
    event.stopPropagation();
  }

}
