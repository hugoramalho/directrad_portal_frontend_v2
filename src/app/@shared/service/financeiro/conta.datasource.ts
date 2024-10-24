/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 02/04/2024
 **/

// financeiro-cadastro-data-source.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {environment} from "../../../../environments/environment";
import {ApiResponse} from "../../model/api-response";
import {Conta} from "../../model/financeiro/conta";
import {Categoria} from "../../model/financeiro/categoria";
import {AppCache} from "../../../@core/cache/app.cache";
import {an} from "@fullcalendar/core/internal-common";


@Injectable({
    providedIn: 'root'
})
export class ContaFinanceiroDataSource {
    private contasUrl = `${environment.apiBaseUrl}/financeiro/contas`;
    private contasCache = new BehaviorSubject<Conta[]>([]);
    private apiUrl = `${environment.apiBaseUrl}/financeiro/contas`;

    constructor(
        private http: HttpClient,
        private cache: AppCache
    ) {
        // this.loadContas();
    }

    getContaById(id: number|null|undefined): Observable<Conta|null> {
        if (!id) {
            return of(null);
        }


        return this.cache.get(`${this.apiUrl}/${id}`)
            .pipe(
                map(response => {
                    return response ?? null;
                }),
                catchError(err => {
                    // Pode-se decidir logar o erro, mostrar uma mensagem para o usuário, etc.
                    console.error('Erro ao obter dados da conta:', err);
                    // Retorna um Observable que emite 'null' como fallback
                    return of(null);
                })
            );


        // return this.http.get<ApiResponse<Conta>>(`${this.apiUrl}/${id}`)
        //     .pipe(
        //         map(response => {
        //             return response.data ?? null;
        //         }),
        //         catchError(err => {
        //             // Pode-se decidir logar o erro, mostrar uma mensagem para o usuário, etc.
        //             console.error('Erro ao obter dados da conta:', err);
        //             // Retorna um Observable que emite 'null' como fallback
        //             return of(null);
        //         })
        //     );
    }

    getContas(): Observable<Conta[]|null> {
        return this.cache.get(this.apiUrl)
            .pipe(
                map(response => {
                    console.log('contas get', response)
                    return response ?? null;
                }),
                catchError(err => {
                    console.error('Erro ao obter dados da conta:', err);
                    return of(null);
                })
            );
    }

    initiateCache(): Observable<any> {
        return this.cache.initiateResourceCache(this.apiUrl);
    }

    // private loadContas(): void {
    //     this.http.get<ApiResponse<Conta[]>>(this.contasUrl).subscribe(response => {
    //         this.contasCache.next(response.data);
    //     });
    // }

    // get contas(): Observable<Conta[]> {
    //     return this.contasCache.asObservable();
    // }

    // create(conta: Conta): Observable<Conta> {
    //     return this.http.post<ApiResponse<Conta>>(this.contasUrl, conta).pipe(
    //         tap((response) => {
    //             // Recarrega o cache após cadastrar conta
    //             this.loadContas();
    //         })
    //     );
    // }
    //
    // update(conta: Conta): Observable<Conta> {
    //     return this.http.put<ApiResponse<Conta>>(`${this.contasUrl}/${conta.id}`, conta).pipe(
    //         tap((response) => {
    //             // Recarrega o cache após atualizar a conta
    //             this.loadContas();
    //         })
    //     );
    // }
}
