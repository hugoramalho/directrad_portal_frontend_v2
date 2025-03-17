import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {ApiResponseInterface} from '../../model/http/api-response-interface';
import {ApiResponsePaginated} from '../../model/http/api-response-paginated';
import {catchError, map} from "rxjs/operators";
import {PaginatedListInterface} from '../../model/http/paginated-list-interface';
import {Estudo} from '../../model/estudo/exame';
import {DcmQueryParams} from '../../dcm/query-params';
import {TagDicom} from "../../model/estudo/tag-dicom";
import {AETitleRepository} from "../../repository/aetitle.repository";
import {Aetitle} from "../../model/pacs/aetitle";

@Injectable({
    providedIn: 'root',
})
export class AetitleService {

    private apiUrl = `${environment.api_v1_base_url}`;

    constructor(
        private http: HttpClient,
        private aetitleRepository: AETitleRepository
    ) {
    }

    public queryAetitles(queryParams: Record<string, any>): Observable<Aetitle[]>
    {
        return this.aetitleRepository.getAETitles();
    }



    public getEstudos(page: number = 1, perPage: number = 10, queryParams: Record<string, any> | null = null): Observable<Estudo[]> {
        let params = new HttpParams();
        // .set('page', page.toString())
        // .set('page_size', perPage.toString());
        if (queryParams) {
            Object.keys(queryParams).forEach((key) => {
                const value = queryParams[key];
                if (value !== null && value !== undefined && value !== '') {
                    params = params.set(key, value);
                }
            });
        }
        return this.http.get<Estudo[]>(this.apiUrl, { params });
    }

    public getEstudo(uid: string): Observable<Estudo[]> {
        let params = new HttpParams()
            .set('study_uid', uid);
        return this.http.get<Estudo[]>(this.apiUrl, { params });
    }

    public getTagsDicom(): Observable<any> {
        return this.http.get<any>(this.apiUrl + '/tags-dicom');
    }

}
