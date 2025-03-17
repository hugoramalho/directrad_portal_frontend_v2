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
import {Pacs} from "../../../painel-controle/pacs/pacs";
import {PacsRepository} from "../../repository/pacs.repository";

@Injectable({
    providedIn: 'root',
})
export class PacsService {

    private apiUrl = `${environment.api_v1_base_url}`;

    constructor(
        private http: HttpClient,
        private pacsRepository: PacsRepository,

    ) {
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

    getPacs(pacs: Pacs | null | undefined, page: number = 1, perPage: number = 10): Observable<PaginatedListInterface<Pacs[]> | null>{
        if (pacs) {
            let params = new HttpParams()
                .set('page', page)
                .set('per_page', perPage);
            const url = this.apiUrl + '/pacs/' + pacs.id;
            return this.http.get<ApiResponseInterface<PaginatedListInterface<Pacs[]> | null>>(url, {params})
                .pipe(
                    map(response => {
                            return response.data || null
                        }
                    ),
                    catchError(err => {
                        console.error('Erro ao obter dados do PACS:', err);
                        return of(null);
                    })
                );
        }
        return of(null);
    }

    get() {
        return this.pacsRepository.get();
    }

}
