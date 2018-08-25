import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { HttpClient, HttpClientModule, HttpResponse } from '@angular/common/http';

import { HttpModule } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ValueTransformer } from '../../../../node_modules/@angular/compiler/src/util';

@Injectable()
export class UtilitiesService {
    @BlockUI() blockUI: NgBlockUI;
    private badDebtWidow: any;
    private _badDebtsResults: any;

    public constructor(
        private http: HttpClient
    ) { }

    setCookie(name, value, hours) {
        let expires = '';
        if (hours) {
            const date = new Date();
            date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }

    getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }

    deleteCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    }

    getPlayersTreeData(groupBy) {

    }

    // To filter data with key and value. 
    // Basically this function is not necessary as the db query will return with some value.
    getFilteredData(dataArray, filterKey, filterValue) {
        const filterArray = dataArray.filter((value) => {
            return (value[filterKey] === filterValue);
        });
        return this.getResponseInFormat(filterArray);
    }

    getResponseInFormat(filterArray) {
        if (filterArray.length > 0) {
            return {
                'actionStatus': 'SUCCESS',
                'actionResult': 'Fetched Result Successfully.',
                'statusCode': 200,
                'apiResult' : filterArray
            };
        } else {
            return {
                'actionStatus': 'FAIL',
                'actionResult': 'No Result Found.',
                'statusCode': 200,
                'apiResult' : []
            };
        }
    }
}