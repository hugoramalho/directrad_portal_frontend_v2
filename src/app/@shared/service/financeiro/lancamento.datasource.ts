/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 02/04/2024
 **/

// financeiro-cadastro-data-source.service.ts
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, forkJoin, Observable, of} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {environment} from "../../../../environments/environment";
import {ApiResponseInterface} from "../../model/http/api-response-interface";
import {ApiResponsePaginated} from "../../model/http/api-response-paginated";
import {Lancamento} from "../../model/financeiro/lancamento";
import {PaginatedListInterface} from "../../model/http/paginated-list-interface";
import {CategoriaFinanceiroDataSource} from "./categoria.datasource";
import {TagDatasource} from "./tag.datasource";
import {ContaFinanceiroDataSource} from "./conta.datasource";
import {Conta} from "../../model/financeiro/conta";
import {AppCache} from "../../../@core/cache/app.cache";



@Injectable({
    providedIn: 'root'
})
export class LancamentoFinanceiroDataSource {
    private apiUrl = `${environment.api_v1_base_url}/financeiro/lancamentos`;

    private lancamentosCache = new BehaviorSubject<Conta[]>([]);
    private lancamentosContaCache = new BehaviorSubject<Conta[]>([]);

    constructor(
        private http: HttpClient,
        private categoriaDataSource: CategoriaFinanceiroDataSource,
        private contaDataSource: ContaFinanceiroDataSource,
        private tagsDataSource: TagDatasource,
        private cache: AppCache

    ) {
        // this.loadLancamentos();
    }

    // private loadLancamentos(): void {
    //     this.http.get<ApiResponse<Conta[]>>(this.apiUrl).subscribe(response => {
    //         this.lancamentosCache.next(response.data);
    //     });
    // }
    //
    // get contas(): Observable<Conta[]> {
    //     return this.lancamentosCache.asObservable();
    // }

    getLancamentosConta(conta: Conta | null, page: number = 1, perPage: number = 10, expand: boolean = false): Observable<PaginatedListInterface<Lancamento[]> | null | void> {
        if(!conta){
            return of(null);
        }
        const url = `${this.apiUrl}/contas/${conta.id}?page=${page}&per_page=${perPage}`;

        return this.http.get<ApiResponseInterface<PaginatedListInterface<Lancamento[]>>>(url)
            .pipe(
                map(response => response.data || null),  // Extrai PaginatedList<Lancamento[]> diretamente
                switchMap(paginatedList => {
                    if (paginatedList && expand && paginatedList?.items) {
                        return this.expandLancamentos(paginatedList.items).pipe(
                            // map(expandedItems =>
                            // )
                        )
                    }
                    return of(paginatedList);  // Retorna como está se não expandir ou items for nulo
                })
            );

        // return this.http.get<ApiResponse<PaginatedList<Lancamento[]>>>(url)
        //     .pipe(
        //         map(response => response.data || null),  // Extrai PaginatedList<Lancamento[]> diretamente
        //         switchMap(paginatedList => {
        //             if (paginatedList && expand && paginatedList?.items) {
        //                 return this.expandLancamentos(paginatedList.items).pipe(
        //                     map(expandedItems => ({
        //                         ...paginatedList,  // Propaga as propriedades de paginatedList
        //                         items: expandedItems  // Substitui items por versões expandidas
        //                     }))
        //                 );
        //             }
        //             return of(paginatedList);  // Retorna como está se não expandir ou items for nulo
        //         })
        //     );
    }

    private expandLancamentos(lancamentos: Lancamento[]): Observable<Lancamento[] | null> {
        return forkJoin(
            lancamentos.map(lancamento =>
                forkJoin({
                    categoria: this.categoriaDataSource.getCategoriaById(lancamento.categoria_id).pipe(
                        catchError(() => {
                            return of(null)
                        })
                    ),
                    conta_origem: this.contaDataSource.getContaById(lancamento.conta_origem_id).pipe(
                        catchError(() => {
                            return of(null)
                        })
                    ),
                    conta_destino: this.contaDataSource.getContaById(lancamento.conta_destino_id).pipe(
                        catchError(() => {
                            return of(null)
                        })
                    ),
                    // tags: this.tagsDataSource.getTagsByIds(lancamento?.tags_id || null).pipe(
                    //     map(response => response || null),
                    //     catchError(() => of(null))
                    // )
                }).pipe(
                    map((
                        {
                            categoria,
                            conta_origem,
                            conta_destino,
                            // tags
                        }) =>
                        ({
                            ...lancamento,
                            categoria: categoria,
                            conta_origem: conta_origem,
                            conta_destino: conta_destino,
                            // tags: tags
                        }
                        )
                    )
                )
            )
        );
    }

    // getLancamentosConta(conta: Conta | null | undefined): Observable<PaginatedList<Lancamento[]>> | null {
    //     if (conta) {
    //         const url = this.apiUrl + '/contas/' + conta.id;
    //         return this.http.get<ApiResponsePaginated<PaginatedList<Lancamento[]>>>(url)
    //             .pipe(map(response => response.data));
    //     }
    //     return null;
    // }
    // getLancamentos(): Observable<PaginatedList<Lancamento[]>> {
    //     return this.http.get<ApiResponse<PaginatedList<Lancamento[]>>>(this.apiUrl)
    //         .pipe(map(response => response.data));
    // }

    // create(conta: Conta): Observable<Conta> {
    //     return this.http.post<ApiResponse<Conta>>(this.apiUrl, conta).pipe(
    //         tap((response) => {
    //             // Recarrega o cache após cadastrar conta
    //             this.loadLancamentos();
    //         })
    //     );
    // }
    //
    // update(conta: Conta): Observable<Conta> {
    //     return this.http.put<ApiResponse<Conta>>(`${this.apiUrl}/${conta.id}`, conta).pipe(
    //         tap((response) => {
    //             // Recarrega o cache após atualizar a conta
    //             this.loadLancamentos();
    //         })
    //     );
    // }
}
