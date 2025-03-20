import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {PacsRepository} from "../../repository/pacs.repository";
import {PaginatedList} from "../../model/http/paginated-list";

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

    get(page: number = 1, page_size: number = 10, queryParams: Record<string, any> | null = null)
    {
        return this.pacsRepository.get(page, page_size, queryParams);
    }

    queryAll()
    {
        return this.pacsRepository.queryAll();
    }

}
