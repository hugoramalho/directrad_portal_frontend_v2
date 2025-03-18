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

    get() {
        return this.pacsRepository.get();
    }

}
