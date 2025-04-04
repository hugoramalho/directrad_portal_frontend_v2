// // import { Injectable } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';
// // import { Observable } from 'rxjs';

// // @Injectable({
// //   providedIn: 'root',
// // })
// // export class EstudoService {
// //   private apiUrl = 'URL_DO_SEU_BACKEND';

// //   constructor(private http: HttpClient) {}

// //   // Método para recuperar a lista de exames
// //   getExames(): Observable<Exame[]> {
// //     return this.http.get<Exame[]>(`${this.apiUrl}/exames`);
// //   }

// //   // Método para enviar um estudos editado
// //   updateExame(estudos: Exame): Observable<Exame> {
// //     return this.http.put<Exame>(`${this.apiUrl}/exames/${estudos.id}`, estudos);
// //   }
// // }
// // /


import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ApiResponseInterface} from '../../@shared/model/http/api-response-interface';
import {ApiResponsePaginated} from '../../@shared/model/http/api-response-paginated';
import {catchError, map} from "rxjs/operators";
import {PaginatedListInterface} from '../../@shared/model/http/paginated-list-interface';
import {Estudo} from './worklist';
import {DcmQueryParams} from '../../@shared/dcm/query-params';
import {TagDicom} from "./tag-dicom";

@Injectable({
    providedIn: 'root',
})
export class WorklistService {

    private apiUrl = `${environment.api_v1_base_url}/estudos`;

    constructor(private http: HttpClient) {
    }

    // getLancamentosConta(estudo: Exame | null | undefined, page: number = 1, perPage: number = 10): Observable<PaginatedList<Exame[]> | null>{
    //     if (estudo) {
    //         let params = new HttpParams()
    //             .set('page', page)
    //             .set('page_size', perPage);


    //         const url = this.apiUrl + '/contas/' + estudo.id;
    //         return this.http.get<ApiResponse<PaginatedList<Exame[]> | null>>(url, {params})
    //             .pipe(
    //                 map(response => {
    //                         return response.data || null
    //                     }
    //                 ),
    //                 catchError(err => {
    //                     console.error('Erro ao obter dados da dados-cadastro:', err);
    //                     return of(null);
    //                 })
    //             );
    //     }
    //     return of(null);
    // }


    // getEstudos(page: number = 1, perPage: number = 10): Observable<PaginatedList<Exame[]> | null> {
    //     let params = new HttpParams()
    //         .set('page', page)
    //         .set('page_size', perPage);
    //     return this.http.get<ApiResponse<PaginatedList<Exame[]> | null>>(this.apiUrl, {params})
    //         .pipe(map(response => response?.data || null));
    // }

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
