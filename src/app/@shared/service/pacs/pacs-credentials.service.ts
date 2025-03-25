/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 25/03/2025
 **/

import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Pacs} from "../../model/pacs/pacs";
import {ApiResponseInterface} from "../../model/http/api-response-interface";
import {PacsCredentials} from "../../model/pacs/pacs-credentials";
import {Observable, of} from 'rxjs';
import {catchError, map} from "rxjs/operators";

@Injectable({
    providedIn: 'root',
})
export class PacsCredentialsService
{
    private apiUrl = `${environment.api_v1_base_url}/pacs`;

    constructor(
        private http: HttpClient,
    ) {
    }

    update(pacsCredentialsData: PacsCredentials): Observable<any>
    {
        return this.http.put<ApiResponseInterface<PacsCredentials>>(
            `${this.apiUrl}/${pacsCredentialsData.pacs_id}/credentials`,
            pacsCredentialsData
        );
    }


    find(pacsCredentialsData: PacsCredentials)
    {
        return this.http.get<ApiResponseInterface<PacsCredentials>>(
            `${this.apiUrl}/${pacsCredentialsData.pacs_id}/credentials/${pacsCredentialsData.id}`
        ).pipe(
            map(response => {
                return response.data || {};
            })
        );
    }

}
