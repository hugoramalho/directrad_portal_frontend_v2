/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 09/03/2025
 **/
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {ApiResponseInterface} from "../model/http/api-response-interface";
import {Pacs} from "../model/pacs/pacs";
import {PaginatedListInterface} from "../model/http/paginated-list-interface";
import {Estudo} from "../model/estudo/exame";
import {PaginatedList} from "../model/http/paginated-list";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "../../../environments/environment";
import {PacsHostType} from "../model/pacs/pacs-host-type";

@Injectable({
    providedIn: 'root'
})
export class PacsRepository {
    private baseUrl = `${environment.api_v1_base_url}/pacs`;
    private pacsSubject = new BehaviorSubject<Map<string, Pacs>>(new Map());
    pacs$ = this.pacsSubject.asObservable();

    constructor(
        private http: HttpClient,
        private snackBar: MatSnackBar
    ) {
    }

    find(pacs_id: number | string): Observable<Pacs[]> {
        return this.http.get<ApiResponseInterface<Pacs[]>>(`${this.baseUrl}/${pacs_id}`)
            .pipe(
                map(response => {
                    return response.data || [];
                }),
                catchError(err => {
                    return of([]);
                })
            );
    }

    queryPaginated(page: number = 1, page_size: number = 10, queryParams: Record<string, any> | null = null): Observable<PaginatedList<Pacs[]>> {
        let params = new HttpParams();
        if (queryParams) {
            Object.keys(queryParams).forEach((key) => {
                const value = queryParams[key];
                if (value !== null && value !== undefined && value !== '') {
                    params = params.set(key, value);
                }
            });
        }
        params = params.set('page', page.toString());
        params = params.set('page_size', page_size.toString());
        return this.http.get<ApiResponseInterface<PaginatedListInterface<Pacs[]>>>(
            `${this.baseUrl}`,
            {params}
        ).pipe(
            map(response => {
                return new PaginatedList<Pacs[]>(response.data)
            }),
            catchError(err => {
                return of(new PaginatedList<Pacs[]>({
                    total: 0,
                    count: 0,
                    page,
                    page_size: page_size,
                    items: []
                }));
            })
        );
    }

    create(pacsData: Pacs) {
        return this.http.post<ApiResponseInterface<Pacs>>(`${this.baseUrl}`, pacsData)
            .pipe(
                map(response => response.data),
                catchError(err => {
                    this.snackBar.open('Erro ao criar Pacs', 'Fechar', {
                        duration: 4000,
                        horizontalPosition: 'right',
                        verticalPosition: 'bottom',
                        // panelClass: ['success-snackbar']
                    });
                    return of(null as any);
                })
            );
    }

    update(pacs: Pacs): Observable<Pacs> {
        return this.http.put<ApiResponseInterface<Pacs>>(`${this.baseUrl}/${pacs.id}`, pacs)
            .pipe(
                map(response => response.data),
                catchError(err => {
                    return of(null as any);
                })
            );
    }

    query(): Observable<Pacs[]> {
        const cachedPacsMap = this.pacsSubject.getValue();
        if (cachedPacsMap.size > 0) {
            return of(Array.from(cachedPacsMap.values()));
        }
        return this.http.get<ApiResponseInterface<Pacs[]>>(`${this.baseUrl}`)
            .pipe(
                map(response => {
                    return response.data || [];
                }),
                catchError(err => {
                    return of([]);
                })
            );
    }

    /** Obtém um PACS específico pelo ID do cache ou da API */
    findPacs(pacsId: string): Observable<Pacs | null> {
        const pacsMap = this.pacsSubject.getValue();
        if (pacsMap.has(pacsId)) {
            return of(pacsMap.get(pacsId)!); // Retorna diretamente do cache
        }

        // Se não estiver no cache, busca na API
        return this.http.get<Pacs>(`${this.baseUrl}/${pacsId}`).pipe(
            tap(pacs => {
                pacsMap.set(pacsId, pacs); // Adiciona ao cache
                this.pacsSubject.next(new Map(pacsMap)); // Atualiza o BehaviorSubject
            }),
            catchError(err => {
                return of(null); // Retorna null em caso de erro
            })
        );
    }


    /** Cria um novo PACS e atualiza o cache */
    // createPacs(pacs: any): Observable<any> {
    //     return this.http.post<{ id: string }>(this.baseUrl, pacs).pipe(
    //         tap(response => {
    //             this.getPacsById(response.id).subscribe(newPacs => {
    //                 const updatedPacs = [...this.pacsSubject.getValue(), newPacs];
    //                 this.pacsSubject.next(updatedPacs);
    //             });
    //         })
    //     );
    // }

    /** Atualiza um PACS no backend e no cache */
    // updatePacs(pacs: any): Observable<any> {
    //     return this.http.put<any>(`${this.baseUrl}/${pacs.id}`, pacs).pipe(
    //         tap(() => {
    //             const updatedPacs = this.pacsSubject.getValue().map(p =>
    //                 p.id === pacs.id ? pacs : p
    //             );
    //             this.pacsSubject.next(updatedPacs);
    //         })
    //     );
    // }

    /** Remove um PACS do backend e do cache */
    // deletePacs(pacsId: string): Observable<void> {
    //     return this.http.delete<void>(`${this.baseUrl}/${pacsId}`).pipe(
    //         tap(() => {
    //             const updatedPacs = this.pacsSubject.getValue().filter(p => p.id !== pacsId);
    //             this.pacsSubject.next(updatedPacs);
    //         })
    //     );
    // }
}
