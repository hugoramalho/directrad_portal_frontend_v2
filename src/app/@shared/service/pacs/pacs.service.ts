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

    create(pacsData: Pacs)
    {
        return this.pacsRepository.create(pacsData);
    }

    update(pacsData: Pacs)
    {
        return this.pacsRepository.update(pacsData);
    }

    find(id: number | string)
    {
        return this.pacsRepository.find(id);
    }

    get(page: number = 1, page_size: number = 10, queryParams: Record<string, any> | null = null)
    {
        return this.pacsRepository.get(page, page_size, queryParams);
    }

    queryAll()
    {
        return this.pacsRepository.queryAll();
    }

}
