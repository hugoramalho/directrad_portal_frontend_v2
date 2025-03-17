/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 09/03/2025
 **/

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    private aetitlesSubject = new BehaviorSubject<any[]>([]);
    aetitles$ = this.aetitlesSubject.asObservable();

    constructor() {}

    /** Retorna os AETitles armazenados no cache */
    getAETitles(): any[] {
        return this.aetitlesSubject.getValue();
    }

    /** Atualiza o cache com uma nova lista de AETitles */
    setAETitles(aetitles: any[]) {
        this.aetitlesSubject.next(aetitles);
    }

    /** Adiciona um AETitle ao cache */
    addAETitle(newAETitle: any) {
        const current = this.getAETitles();
        this.setAETitles([...current, newAETitle]);
    }

    /** Remove um AETitle do cache */
    removeAETitle(id: string) {
        const updated = this.getAETitles().filter(ae => ae.id !== id);
        this.setAETitles(updated);
    }

    /** Atualiza um AETitle no cache */
    updateAETitle(updatedAETitle: any) {
        const current = this.getAETitles().map(ae =>
            ae.id === updatedAETitle.id ? updatedAETitle : ae
        );
        this.setAETitles(current);
    }
}
