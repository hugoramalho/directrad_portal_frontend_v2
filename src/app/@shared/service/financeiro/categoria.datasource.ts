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
import {Categoria} from "../../model/financeiro/categoria";
import {Conta} from "../../model/financeiro/conta";
import {AppCache} from "../../../@core/cache/app.cache";
import {an} from "@fullcalendar/core/internal-common";


@Injectable({
    providedIn: 'root'
})
export class CategoriaFinanceiroDataSource {
    private apiBaseUrl = `${environment.apiBaseUrl}/financeiro/categorias`;

    private categoriasCache= new BehaviorSubject<Conta[]>([]);

    constructor(
        private http: HttpClient,
        private cache: AppCache

    ) {
    }

    getCategoriaById(id: number): Observable<Categoria|null|undefined> {
        return this.cache.get(`${this.apiBaseUrl}/${id}`)
            .pipe(
                map(
                    response=> response || null),
                catchError(err => {
                    // Pode-se decidir logar o erro, mostrar uma mensagem para o usuário, etc.
                    console.error('Erro ao obter dados da conta:', err);
                    // Retorna um Observable que emite 'null' como fallback
                    return of(null);
                })
            );
    }

    getCategorias(): Observable<Categoria[]|null|undefined> {
        return this.http.get<ApiResponse<Categoria[]>>(`${this.apiBaseUrl}`)
            .pipe(map(response => response.data || null));
    }

    // Adiciona uma nova categoria
    createCategoria(categoria: Categoria): Observable<Categoria|null|undefined> {
        return this.http.post<ApiResponse<Categoria>>(this.apiBaseUrl, categoria)
            .pipe(map(response => response.data || null));
    }

    // Atualiza uma categoria existente
    updateCategoria(categoria: Categoria): Observable<Categoria|null|undefined> {
        return this.http.put<ApiResponse<Categoria>>(`${this.apiBaseUrl}/${categoria.id}`, categoria)
            .pipe(map(response => response.data));
    }

    // Exclui uma categoria pelo ID
    deleteCategoria(id: number): Observable<Categoria|null|undefined> {
        return this.http.delete<ApiResponse<|null|undefined>>(`${this.apiBaseUrl}/${id}`)
            .pipe(map(response => response.data));
    }

    initiateCache(): Observable<any>{
        return this.cache.initiateResourceCache(this.apiBaseUrl);
    }
}
