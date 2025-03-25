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
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../@shared/model/api-response';
import { ApiResponsePaginated } from '../../@shared/model/api-response-paginated';
import {catchError, map} from "rxjs/operators";
import { PaginatedList } from '../../@shared/model/paginated-list';
import { Pacs } from './pacs';

@Injectable({
    providedIn: 'root',
})
export class EstudoRepository {

    private apiUrl = `${environment.apiBaseUrl}/financeiro/lancamentos`;

    constructor(private http: HttpClient) {
    }

    getPacs(pacs: Pacs | null | undefined, page: number = 1, perPage: number = 10): Observable<PaginatedList<Pacs[]> | null>{
        if (pacs) {
            let params = new HttpParams()
                .set('page', page)
                .set('per_page', perPage);


            const url = this.apiUrl + '/pacs/' + pacs.id;
            return this.http.get<ApiResponse<PaginatedList<Pacs[]> | null>>(url, {params})
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


    getLancamentos(page: number = 1, perPage: number = 10): Observable<PaginatedList<Pacs[]> | null> {
        let params = new HttpParams()
            .set('page', page)
            .set('page_size', perPage);
        return this.http.get<ApiResponse<PaginatedList<Pacs[]> | null>>(this.apiUrl, {params})
            .pipe(map(response => response?.data || null));
    }

}
