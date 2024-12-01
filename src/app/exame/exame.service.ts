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
import { environment } from '../../environments/environment';
import { ApiResponse } from '../@shared/model/api-response';
import { ApiResponsePaginated } from '../@shared/model/api-response-paginated';
import {catchError, map} from "rxjs/operators";
import { PaginatedList } from '../@shared/model/paginated-list';
import { Exame } from './exame';

@Injectable({
    providedIn: 'root',
})
export class EstudoRepository {

    private apiUrl = `${environment.apiBaseUrl}/estudos`;

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
    //                     console.error('Erro ao obter dados da conta:', err);
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

    getEstudos(page: number = 1, perPage: number = 10): Observable<Exame[]>  {
      let params = new HttpParams()
          .set('page', page)
          .set('page_size', perPage);
      return this.http.get<Exame[]>(this.apiUrl);
  }

}
