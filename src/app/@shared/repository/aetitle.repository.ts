import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {CacheService} from "../cache/app.cache";
import {Aetitle} from "../model/pacs/aetitle";
import {ApiResponseInterface} from "../model/http/api-response-interface";
import {catchError, map} from "rxjs/operators";
import {Pacs} from "../model/pacs/pacs";

@Injectable({
    providedIn: 'root'
})
export class AETitleRepository {
    private baseUrl = '/api/v1/pacs'; // Base da API
    private aetitlesSubject = new BehaviorSubject<Aetitle[]>([]);
    constructor(private http: HttpClient, private cacheService: CacheService) {}

    /** Obtém AETitles do cache ou API */
    getPacsAETitles(pacsId: string|number|null): Observable<Aetitle[]> {
        const cachedAETitles = this.cacheService.getAETitles();
        if (cachedAETitles.length > 0) {
            return of(cachedAETitles); // Retorna cache se disponível
        }
        return this.http.get<ApiResponseInterface<Aetitle[]>>(`${this.baseUrl}/${pacsId}/aetitles`).pipe(
            map(response => response.data || []), // Extrai os dados da resposta
            tap(aetitles => this.aetitlesSubject.next(aetitles)), // Atualiza cache
            catchError(err => {
                console.error('Erro ao obter AETitles:', err);
                return of([]); // Retorna um array vazio em caso de erro
            })
        );
    }

    /** Obtém AETitles do cache ou API */
    getAETitles(): Observable<Aetitle[]> {
        const cachedAETitles = this.cacheService.getAETitles();
        if (cachedAETitles.length > 0) {
            return of(cachedAETitles); // Retorna cache se disponível
        }
        return this.http.get<ApiResponseInterface<Aetitle[]>>(`${this.baseUrl}/aetitles`).pipe(
            map(response => response.data || []), // Extrai os dados da resposta
            tap(aetitles => this.aetitlesSubject.next(aetitles)), // Atualiza cache
            catchError(err => {
                console.error('Erro ao obter AETitles:', err);
                return of([]); // Retorna um array vazio em caso de erro
            })
        );
    }

    /** Cria um novo AETitle e atualiza o cache */
    createAETitle(pacsId: string, aetitle: any): Observable<any> {
        return this.http.post<{ id: string }>(`${this.baseUrl}/${pacsId}/aetitles`, aetitle).pipe(
            tap(response => {
                // Após criar, buscamos a entidade pelo ID retornado para garantir que temos os dados atualizados
                this.getAETitleById(pacsId, response.id).subscribe(createdAETitle => {
                    this.cacheService.addAETitle(createdAETitle);
                });
            })
        );
    }

    /** Obtém um AETitle específico */
    getAETitleById(pacsId: string, id: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${pacsId}/aetitles/${id}`);
    }

    /** Atualiza um AETitle na API e no cache */
    updateAETitle(pacsId: string, aetitle: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${pacsId}/aetitles/${aetitle.id}`, aetitle).pipe(
            tap(() => this.cacheService.updateAETitle(aetitle))
        );
    }

    /** Remove um AETitle da API e do cache */
    deleteAETitle(pacsId: string, id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${pacsId}/aetitles/${id}`).pipe(
            tap(() => this.cacheService.removeAETitle(id))
        );
    }
}
