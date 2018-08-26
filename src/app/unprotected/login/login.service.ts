import { HttpClient, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';

import { AmazonFirebaseSupportService } from '../../shared/guard/amazon-firebase-support.service';
import { AppConfigService } from '../../shared/services/app-config.service';
import { Injectable } from '@angular/core';
import { Login } from './login.interface';
import { Observable } from 'rxjs/Observable';
import { UtilitiesService } from './../../shared/services/utilities.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private appConfigService: AppConfigService,
    private amazonFirebaseSupportService: AmazonFirebaseSupportService,
    private utilitiesService: UtilitiesService
  ) { }

  login(reqObj): Observable<any> {
    const getLoginResponse = this.appConfigService.url + '/' + this.appConfigService.urlConstants['SPORTS_PORTAL_LOGIN_API'];
    return this.http
      .get(getLoginResponse)
      .map((response: Response) => {
        const result = this.utilitiesService.getFilteredData(response, 'email', reqObj.email);
        return result;
      })
      .catch(this.handleError);
  }


  logout(): Observable<any> {
    const getLogoutRequest = this.appConfigService.url + '/' + this.appConfigService.urlConstants['SPORTS_PORTAL_LOGOUT_API'];
    return this.http
      .get(getLogoutRequest)
      .map((response: Response) => {
        return response;
      })
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    return Observable.throw(error.statusText);
  }
}
