/**
    Created by: Hugo Ramalho <ramalho.hg@gmail.com>

    Created at: 12/05/2024
**/

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import {map} from "rxjs/operators";
import {CategoriaFinanceiroDataSource} from "../@shared/service/financeiro/categoria.datasource";
import {LancamentoFinanceiroDataSource} from "../@shared/service/financeiro/lancamento.datasource";
import {ContaFinanceiroDataSource} from "../@shared/service/financeiro/conta.datasource";

@Injectable({
    providedIn: 'root'
})
export class FinanceiroCacheResolver implements Resolve<boolean> {
    constructor(
        private categoriaDatasource: CategoriaFinanceiroDataSource,
        private lancamentoDatasource: LancamentoFinanceiroDataSource,
        private contasDatasource: ContaFinanceiroDataSource
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        // Assumindo que initiateCacheCategorias e initiateCacheTags retornam Observable<boolean> que completa quando o cache está pronto.
        return forkJoin({
            categorias: this.categoriaDatasource.initiateCache(),
            contas: this.contasDatasource.initiateCache()
        });
    }
}
