import { HttpClient, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';

import { AmazonFirebaseSupportService } from '../../../shared/guard/amazon-firebase-support.service';
import { AppConfigService } from '../../../shared/services/app-config.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { map } from '../../../../../node_modules/rxjs-compat/operator/map';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(
    private http: HttpClient,
    private appConfigService: AppConfigService,
    private utilitiesService: UtilitiesService,
    private amazonFirebaseSupportService: AmazonFirebaseSupportService
  ) { }

  fetchAllPlayers(groupBy) {
    const getLoginResponse = this.appConfigService.url + '/' + this.appConfigService.urlConstants['FETCH_ALL_PLAYERS'];
    return this.http
      .get(getLoginResponse)
      .map((response: Response) => {
        const updatedResponse = this.reInitializeData(response);
        const result = this.utilitiesService.getResponseInFormat(updatedResponse);
        return result;
      })
      .catch(this.handleError);
  }

  getPlayerDetails(playerID) {
    const getLoginResponse = this.appConfigService.url + '/' + this.appConfigService.urlConstants['FETCH_ALL_PLAYERS'];
    return this.http
      .get(getLoginResponse)
      .map((response: Response) => {
        const updatedResponse = this.reInitializeData(response);
        const result = this.utilitiesService.getResponseInFormat(updatedResponse);
        return result;
      })
      .catch(this.handleError);
  }

  addNewPlayer(playerInfo) {

    // The actual function to be executed is below

    const getLoginResponse = this.appConfigService.url + '/' + this.appConfigService.urlConstants['FETCH_ALL_PLAYERS'];
    return this.http
      .post(getLoginResponse, playerInfo)
      .map((response: Response) => {
        const result = this.utilitiesService.getResponseInFormat(response);
        return result;
      })
      .catch(this.handleError);

      // this.amazonFirebaseSupportService.addItemToDB('/players', playerInfo);
      // return new Observable().map(() => {
      //   return {
      //     'actionStatus': 'SUCCESS',
      //     'actionResult': 'Fetched Result Successfully.',
      //     'statusCode': 200,
      //     'apiResult' : []
      // };
      // }).catch(this.handleError);
  }

  editPlayer(playerInfo) {
    // The actual function to be executed is below
   const getLoginResponse = this.appConfigService.url + '/' + this.appConfigService.urlConstants['FETCH_ALL_PLAYERS'];
    return this.http
      .put(getLoginResponse, playerInfo)
      .map((response: Response) => {
        const result = this.utilitiesService.getResponseInFormat(response);
        return result;
      })
      .catch(this.handleError);

      // this.amazonFirebaseSupportService.updateItemToDB('/players', playerInfo, playerInfoIndex);
      // return new Observable().map(() => {
      //   return {
      //     'actionStatus': 'SUCCESS',
      //     'actionResult': 'Fetched Result Successfully.',
      //     'statusCode': 200,
      //     'apiResult' : []
      // };
      // }).catch(this.handleError);
  }

  reInitializeData(dataArray) {
    const result = [];
    for (const key in dataArray) {
      if (dataArray[key]) {
        result.push(dataArray[key]);
      }
    }
    return result;
  }

  private handleError(error: Response) {
    return Observable.throw(error.statusText);
  }
}
