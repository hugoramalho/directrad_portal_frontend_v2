/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 12/01/2025
 **/

import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {PacsRepository} from "../../repository/pacs.repository";
import {PaginatedList} from "../../model/http/paginated-list";
import {Pacs} from "../../model/pacs/pacs";
import {map} from "rxjs/operators";
import {PacsHostType} from "../../model/pacs/pacs-host-type";

@Injectable({
    providedIn: 'root',
})
export class PacsService {

    private apiUrl = `${environment.api_v1_base_url}`;

    constructor(
        private http: HttpClient,
        private pacsRepository: PacsRepository,
    ) {
    }

    create(pacsData: Pacs) {
        return this.pacsRepository.create(pacsData);
    }

    update(pacsData: Pacs) {
        return this.pacsRepository.update(pacsData);
    }

    find(id: number | string) {
        return this.pacsRepository.find(id);
    }

    queryPaginated(page: number = 1, page_size: number = 10, queryParams: Record<string, any> | null = null) {
        return this.pacsRepository.queryPaginated(page, page_size, queryParams).pipe(
            map(response => {
                response.items = response.items.filter(pacs => {
                    return pacs.tipo_pacs == PacsHostType.PACS_CLIENTE;
                });
                return response;
            })
        );
    }

    query() {
        return this.pacsRepository.query().pipe(
            map(response => {
                return response.filter(pacs => {
                    return pacs.tipo_pacs == PacsHostType.PACS_CLIENTE;
                })
            })
        );
    }

    search(
        allPacs: Pacs[],
        page: number = 1,
        pageSize: number = 10,
        filters: Record<string, any> = {}
    ): PaginatedList<Pacs[]> {
        let filtered = allPacs.filter(pacs => pacs.tipo_pacs === PacsHostType.PACS_CLIENTE);
        Object.entries(filters).forEach(([key, value]) => {
            if (value && typeof value === 'string') {
                filtered = filtered.filter(pacs =>
                    (pacs[key as keyof Pacs] ?? '')
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase())
                );
            }
        });
        const total = filtered.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginated = filtered.slice(startIndex, endIndex);
        return {
            count: paginated.length,
            items: paginated,
            total: total,
            page: page,
            page_size: pageSize,
        };
    }

}
