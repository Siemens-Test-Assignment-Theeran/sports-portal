import { Component, OnInit } from '@angular/core';

import { MainDataService } from './services/main-data.service';
import { MainService } from './services/main.service';
import { Player } from './main.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [MainService]
})
export class MainComponent implements OnInit {
  private showAddEditPane: boolean;
  private playersData: Player[];
  private groupBy: string;
  private fetchPlayerFail: boolean;
  constructor(private mainService: MainService) { }

  ngOnInit() {
    this.fetchPlayerFail = false;
    this.showAddEditPane = false;
    this.groupBy = 'country';
    this.playersData = [];
    this.fetchPlayersData();
  }

  fetchPlayersData() {
    this.mainService.fetchAllPlayers(this.groupBy).subscribe(
      data => {
        console.log(data);
        if (data.actionStatus === 'SUCCESS') {
          this.playersData = this.getPlayersByGroupBy(data.apiResult, this.groupBy);
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

  getPlayersByGroupBy(data, groupBy)  {
    const result = data.reduce(function (r, a) {
      r[a[groupBy]] = r[a[groupBy]] || [];
      r[a[groupBy]].push(a);
      return r;
    }, Object.create(null));
    console.log(result);
    return this.getTreeJSON(result);
  }

  getTreeJSON(jsonData) {
    const result = [];
    for (const key in jsonData) {
      if (jsonData[key].length > 0) {
        const resultObj = {
          'name': key,
          'isHeader': true,
          'players': jsonData[key]
        };
        result.push(resultObj);
      }
    }
    console.log(result);
    return result;
  }

}
