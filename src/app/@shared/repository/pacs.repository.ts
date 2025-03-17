/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 09/03/2025
 **/
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {ApiResponseInterface} from "../model/http/api-response-interface";
import {Pacs} from "../model/pacs/pacs";

@Injectable({
    providedIn: 'root'
})
export class PacsRepository {
    private baseUrl = '/api/v1/pacs';
    private pacsSubject = new BehaviorSubject<Map<string, Pacs>>(new Map());
    pacs$ = this.pacsSubject.asObservable();

    constructor(private http: HttpClient) {
    }

    /** Obtém os PACS do cache ou da API */
    get(): Observable<Pacs[]> {
        const cachedPacsMap = this.pacsSubject.getValue();
        if (cachedPacsMap.size > 0) {
            return of(Array.from(cachedPacsMap.values())); // Retorna os valores do Map como array
        }
        return this.http.get<ApiResponseInterface<Pacs[]>>(`${this.baseUrl}`).pipe(
            map(response => response.data || []),
            tap((pacsArray: Pacs[]) => {
                const pacsMap = new Map<string, Pacs>();
                pacsArray.forEach(pacs => pacsMap.set(pacs.id, pacs)); // Converte array para Map
                this.pacsSubject.next(pacsMap);
            }),
            catchError(err => {
                console.error('Erro ao obter PACS:', err);
                return of([]); // Retorna um array vazio em caso de erro
            })
        );
    }

    /** Obtém um PACS específico */
    getPacsById(pacsId: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${pacsId}`);
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
