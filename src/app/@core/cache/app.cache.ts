/**
    Created by: Hugo Ramalho <ramalho.hg@gmail.com>

    Created at: 12/05/2024
**/


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, mapTo, Observable, of} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {ApiResponseInterface} from "../../@shared/model/http/api-response-interface";
import {AppResource} from "../../@shared/model/financeiro/app-resource";

@Injectable({
    providedIn: 'root'
})
export class AppCache {
    private cache: Record<string, BehaviorSubject<any>> = {};

    constructor(private http: HttpClient) {}

    /**
     * Obtém os dados do cache ou da API se o cache não estiver disponível.
     * @param url URL da API para fetch dos dados.
     * @returns Observable com os dados.
     */
    get(url: string): Observable<any> {
        if (!this.cache[url]) {
            this.cache[url] = new BehaviorSubject<any>(null);  // Inicializa o BehaviorSubject com null.
            this.fetchAndUpdate(url);  // Carrega dados pela primeira vez.
        }
        return this.cache[url].asObservable();  // Retorna o BehaviorSubject como um Observable.
    }

    /**
     * Atualiza os dados do cache fazendo uma requisição HTTP GET.
     * @param url URL da API para fetch dos dados.
     */
    private fetchAndUpdate(url: string): void {
        this.http.get(url)
            .pipe(
                catchError(error => {
                    console.error(`Failed to fetch data from ${url}`, error);
                    return [];  // Retorna um array vazio ou outro valor padrão em caso de erro.
                }),
                tap(data => {
                    this.cache[url].next(data);  // Atualiza o BehaviorSubject com novos dados.
                })
            ).subscribe();  // Inicia a requisição HTTP.
    }

    /**
     * Força a atualização do cache, re-fetching os dados da API.
     * @param url URL da API para re-fetch dos dados.
     */
    public refresh(url: string): void {
        this.fetchAndUpdate(url);  // Refetch dos dados para atualizar o cache.
    }

    public initiateResourceCache(uri: string): Observable<null> {
        return this.http.get<ApiResponseInterface<AppResource[]>>(uri).pipe(
            catchError(error => {
                // Retornamos um Observable de um array vazio para continuar o fluxo no tap seguinte.
                return of(null);
            }),
            tap(resources => {
                if(resources?.data){
                    this.cache[uri] = new BehaviorSubject(resources.data);
                    // resources.data.forEach(resource => {
                    //     const index = uri + `/${resource.id}`;
                    //     this.cache[index] = new BehaviorSubject(resource);
                    // });
                }
            }),
            mapTo(null)  // Transforma a emissão em null, já que não precisamos retornar os dados.
        );
    }
}
