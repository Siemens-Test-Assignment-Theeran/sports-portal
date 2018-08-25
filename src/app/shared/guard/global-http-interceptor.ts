import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UtilitiesService } from '../services/utilities.service';

@Injectable()
export class GlobalHttpInterceptor implements HttpInterceptor {
    constructor(private router: Router, private utilitiesService: UtilitiesService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq: HttpRequest<any>;
        if (this.utilitiesService.getCookie('isLoggedIn') === 'true') {
            const appSessionKey = this.utilitiesService.getCookie('sessionKey');
            const newHttpHeaders = new HttpHeaders({
                'appSessionKey': appSessionKey
            });
            authReq = req.clone({
                headers: newHttpHeaders
            });
        } else {
            authReq = req;
        }
        // Clone the request to add the new header.
        // send the newly created request
        return next.handle(authReq)
            .catch((error, caught) => {
                if ((error instanceof HttpErrorResponse) &&
                    (((<HttpErrorResponse>error).status === 500) || ((<HttpErrorResponse>error).status === 777))
                ) {
                    console.log(error);
                } else {
                    return Observable.throw(error);
                }
            }) as any;
    }
}