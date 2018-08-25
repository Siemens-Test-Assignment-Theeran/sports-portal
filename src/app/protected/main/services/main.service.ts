import { HttpClient, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';

import { AppConfigService } from '../../../shared/services/app-config.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UtilitiesService } from '../../../shared/services/utilities.service';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(
    private http: HttpClient,
    private appConfigService: AppConfigService,
    private utilitiesService: UtilitiesService
  ) { }

  fetchAllPlayers(groupBy) {
    const getLoginResponse = this.appConfigService.url + '/' + this.appConfigService.urlConstants['FETCH_ALL_PLAYERS'];
    return this.http
      .get(getLoginResponse)
      .map((response: Response) => {
        console.log(response);
        const result = this.utilitiesService.getResponseInFormat(response);
        return result;
      })
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    return Observable.throw(error.statusText);
  }
}
