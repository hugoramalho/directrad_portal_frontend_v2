/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 09/05/2024
 **/


import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Lancamento} from '../../model/financeiro/lancamento';
import {ApiResponseInterface} from '../../model/http/api-response-interface';
import {Tag} from '../../model/financeiro/tag';
import {Categoria} from "../../model/financeiro/categoria";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root',
})
export class TagDatasource {

    private apiUrl = `${environment.api_v1_base_url}/financeiro/tags`;

    constructor(private http: HttpClient) {
    }

    getTagsByIds(tags_id: number[] | null | undefined): Observable<Tag[] | null> {
        if (!tags_id) {
            return of(null);
        }
        return this.http.post<ApiResponseInterface<Tag[] | null | undefined>>(this.apiUrl + '/ids', {'ids': tags_id})
            .pipe(map(response => response.data || null));
    }


    get(id: number | null | undefined): Observable<Tag | null>  | Observable<null> {
        if (!id) {
            return of(null);
        }
        return this.http.get<ApiResponseInterface<Tag>>(`${this.apiUrl}/${id}`)
            .pipe(map(response => response.data || null));
    }
}

