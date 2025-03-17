/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 02/04/2024
 **/

import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Lancamento} from '../../model/financeiro/lancamento';
import {ApiResponseInterface} from '../../model/http/api-response-interface';
import {ApiResponsePaginated} from '../../model/http/api-response-paginated';
import {Conta} from '../../model/financeiro/conta';
import {catchError, map} from "rxjs/operators";
import {PaginatedListInterface} from "../../model/http/paginated-list-interface";

@Injectable({
    providedIn: 'root',
})
export class LancamentoRepository {

    private apiUrl = `${environment.api_v1_base_url}/financeiro/lancamentos`;

    constructor(private http: HttpClient) {
    }

    getLancamentosConta(conta: Conta | null | undefined, page: number = 1, perPage: number = 10): Observable<PaginatedListInterface<Lancamento[]> | null>{
        if (conta) {
            let params = new HttpParams()
                .set('page', page)
                .set('per_page', perPage);


            const url = this.apiUrl + '/contas/' + conta.id;
            return this.http.get<ApiResponseInterface<PaginatedListInterface<Lancamento[]> | null>>(url, {params})
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


    getLancamentos(page: number = 1, perPage: number = 10): Observable<PaginatedListInterface<Lancamento[]> | null> {
        let params = new HttpParams()
            .set('page', page)
            .set('per_page', perPage);
        return this.http.get<ApiResponseInterface<PaginatedListInterface<Lancamento[]> | null>>(this.apiUrl, {params})
            .pipe(map(response => response?.data || null));
    }

}
