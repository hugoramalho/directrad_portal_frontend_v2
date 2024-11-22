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
 import {environment } from '../../../../environments/environment';
 import { ApiResponse } from '../../../@shared/model/api-response';
 import { ApiResponsePaginated } from '../../../@shared/model/api-response-paginated';
//  import {Conta} from '../../model/financeiro/conta';
 import {catchError, map} from "rxjs/operators";
 import { PaginatedList } from '../../../@shared/model/paginated-list';
import { Estudo } from '../model/estudo';
 
 @Injectable({
     providedIn: 'root',
 })
 export class EstudoRepository {
 
     private apiUrl = `${environment.apiBaseUrl}/financeiro/lancamentos`;
 
     constructor(private http: HttpClient) {
     }
 
     getLancamentosConta(estudo: Estudo | null | undefined, page: number = 1, perPage: number = 10): Observable<PaginatedList<Lancamento[]> | null>{
         if (estudo) {
             let params = new HttpParams()
                 .set('page', page)
                 .set('per_page', perPage);
 
 
             const url = this.apiUrl + '/contas/' + estudo.id;
             return this.http.get<ApiResponse<PaginatedList<Estudo[]> | null>>(url, {params})
                 .pipe(
                     map(response => {
                             return response.data || null
                         }
                     ),
                     catchError(err => {
                         console.error('Erro ao obter dados da conta:', err);
                         return of(null);
                     })
                 );
         }
         return of(null);
     }
 
 
     getLancamentos(page: number = 1, perPage: number = 10): Observable<PaginatedList<Lancamento[]> | null> {
         let params = new HttpParams()
             .set('page', page)
             .set('per_page', perPage);
         return this.http.get<ApiResponse<PaginatedList<Lancamento[]> | null>>(this.apiUrl, {params})
             .pipe(map(response => response?.data || null));
     }
 
 }
 