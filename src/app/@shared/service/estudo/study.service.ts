/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 30/11/2024
 **/

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
import {PacsService} from "../pacs/pacs.service";
import {AetitleService} from "../pacs/aetitle.service";
import {UserService} from "../usuario/user.service";
import {Aetitle} from "../../model/pacs/aetitle";
import {PaginatedList} from "../../model/http/paginated-list";
import {Pacs} from "../../model/pacs/pacs";

@Injectable({
    providedIn: 'root',
})
export class EstudoService {

    private baseUrl = `${environment.api_v1_base_url}`;

    constructor(
        private http: HttpClient,
        public aetitleService: AetitleService,
        public pacsService: PacsService,
        public userService: UserService,
    ) {
    }

    update(estudo: Estudo, pacs: Pacs): Observable<any>
    {
        return this.http.put<ApiResponseInterface<any>>(
            `${this.baseUrl}/pacs/${pacs.id}/studies/${estudo.StudyInstanceUID}`,
            {estudo}
        );
    }

    public getEstudos(page: number = 1, page_size: number = 10, queryParams: Record<string, any> | null = null): Observable<PaginatedListInterface<Estudo[]>> {
        let params = new HttpParams();
        let offset = (page - 1) * page_size;
        let limit = (page_size);

        let user = this.userService.getUser()

        if (queryParams) {
            Object.keys(queryParams).forEach((key) => {
                const value = queryParams[key];
                if (value !== null && value !== undefined && value !== '') {
                    params = params.set(key, value);
                }
            });
        }
        params = params.set('offset', offset.toString());
        params = params.set('limit', limit.toString());
        return this.http
            // .get<ApiResponseInterface<PaginatedListInterface<Estudo[]>>>(
            //     `${this.baseUrl}/pacs/${user?.pacs_id}/aetitles/${user?.aetitle_id}/studies`,
            //     { params }
            // )
            .get<ApiResponseInterface<PaginatedListInterface<Estudo[]>>>(
                `${this.baseUrl}/pacs/studies`,
                {params}
            )
            .pipe(
                map(response => {
                    if (!response.success) {
                        // Retorna uma instância de PaginatedList com um array vazio
                        return new PaginatedList<Estudo[]>({
                            total: 0,
                            count: 0,
                            page,
                            page_size: limit,
                            items: []
                        });
                    }
                    return new PaginatedList<Estudo[]>(response.data);
                }),
                catchError(() => {
                    // Retorna uma instância vazia em caso de erro
                    return of(new PaginatedList<Estudo[]>({
                        total: 0,
                        count: 0,
                        page,
                        page_size: limit,
                        items: []
                    }));
                })
            );
    }

    public getEstudo(uid: string | null | undefined): Observable<Estudo[]> {
        if (!uid) {
            return of([]);
        }
        let params = new HttpParams()
            .set('study_uid', uid);
        return this.http.get<Estudo[]>(this.baseUrl, {params});
    }

    public getTagsDicom(): Observable<any> {
        return this.http.get<any>(this.baseUrl + '/tags-dicom');
    }

}
