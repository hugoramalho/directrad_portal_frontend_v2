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

// //   // Método para enviar um exame editado
// //   updateExame(exame: Exame): Observable<Exame> {
// //     return this.http.put<Exame>(`${this.apiUrl}/exames/${exame.id}`, exame);
// //   }
// // }
// // /



import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponseInterface } from '../../@shared/model/http/api-response-interface';
import { ApiResponsePaginated } from '../../@shared/model/http/api-response-paginated';
import {catchError, map} from "rxjs/operators";
import { PaginatedListInterface } from '../../@shared/model/http/paginated-list-interface';
import { Pacs } from './pacs';

@Injectable({
    providedIn: 'root',
})
export class EstudoRepository {

    private apiUrl = `${environment.api_v1_base_url}/financeiro/lancamentos`;

    constructor(private http: HttpClient) {
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


    getLancamentos(page: number = 1, perPage: number = 10): Observable<PaginatedListInterface<Pacs[]> | null> {
        let params = new HttpParams()
            .set('page', page)
            .set('page_size', perPage);
        return this.http.get<ApiResponseInterface<PaginatedListInterface<Pacs[]> | null>>(this.apiUrl, {params})
            .pipe(map(response => response?.data || null));
    }

}
