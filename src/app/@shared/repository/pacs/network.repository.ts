/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 24/03/2025
 **/

import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {ApiResponseInterface} from "../../model/http/api-response-interface";
import {catchError, map} from "rxjs/operators";
import {PaginatedList} from "../../model/http/paginated-list";
import {PaginatedListInterface} from "../../model/http/paginated-list-interface";
import {PacsNetwork} from "../../model/pacs/network";
import {Pacs} from "../../model/pacs/pacs";
import {environment} from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class PacsNetworkRepository {
    private baseUrl = `${environment.api_v1_base_url}/pacs`;
    private aetitlesSubject = new BehaviorSubject<PacsNetwork[]>([]);

    constructor(private http: HttpClient) {
    }


    query(pacsId: number | string | undefined, queryParams: Record<string, any> | null = null): Observable<PacsNetwork[]> {
        if(!pacsId) {
            return of([]);
        }
        let params = new HttpParams();
        if (queryParams) {
            Object.keys(queryParams).forEach((key) => {
                const value = queryParams[key];
                if (value !== null && value !== undefined && value !== '') {
                    params = params.set(key, value);
                }
            });
        }
        return this.http.get<ApiResponseInterface<PacsNetwork[]>>(
            `${this.baseUrl}/${pacsId}/networks`,
            {params}
        ).pipe(
            map(response => response.data || []),
            catchError(err => {
                return of([]);
            })
        );
    }


}
