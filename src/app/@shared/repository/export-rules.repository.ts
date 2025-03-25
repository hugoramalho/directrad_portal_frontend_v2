/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 09/03/2025
 **/

/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 09/03/2025
 **/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ExportRuleRepository {
    private baseUrl = `${environment.api_v1_base_url}/pacs`;
    private exportRulesSubject = new BehaviorSubject<{ [pacsId: string]: any[] }>({});

    constructor(private http: HttpClient) {}

    /** Obtém regras de exportação de um PACS */
    getExportRules(pacsId: string): Observable<any[]> {
        const cachedRules = this.exportRulesSubject.getValue()[pacsId];
        if (cachedRules) {
            return new Observable(observer => {
                observer.next(cachedRules);
                observer.complete();
            });
        }
        return this.http.get<any[]>(`${this.baseUrl}/${pacsId}/export-rules`).pipe(
            tap(rules => {
                const currentData = this.exportRulesSubject.getValue();
                currentData[pacsId] = rules;
                this.exportRulesSubject.next(currentData);
            })
        );
    }

    /** Obtém uma regra de exportação específica */
    getExportRuleById(pacsId: string, ruleId: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${pacsId}/export-rules/${ruleId}`);
    }

    /** Cria uma nova regra de exportação e atualiza o cache */
    createExportRule(pacsId: string, rule: any): Observable<any> {
        return this.http.post<{ id: string }>(`${this.baseUrl}/${pacsId}/export-rules`, rule).pipe(
            tap(response => {
                this.getExportRuleById(pacsId, response.id).subscribe(newRule => {
                    const currentData = this.exportRulesSubject.getValue();
                    const updatedRules = [...(currentData[pacsId] || []), newRule];
                    currentData[pacsId] = updatedRules;
                    this.exportRulesSubject.next(currentData);
                });
            })
        );
    }

    /** Atualiza uma regra de exportação */
    updateExportRule(pacsId: string, rule: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${pacsId}/export-rules/${rule.id}`, rule).pipe(
            tap(() => {
                const currentData = this.exportRulesSubject.getValue();
                currentData[pacsId] = currentData[pacsId].map(r =>
                    r.id === rule.id ? rule : r
                );
                this.exportRulesSubject.next(currentData);
            })
        );
    }

    /** Remove uma regra de exportação */
    deleteExportRule(pacsId: string, ruleId: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${pacsId}/export-rules/${ruleId}`).pipe(
            tap(() => {
                const currentData = this.exportRulesSubject.getValue();
                currentData[pacsId] = currentData[pacsId].filter(r => r.id !== ruleId);
                this.exportRulesSubject.next(currentData);
            })
        );
    }
}
