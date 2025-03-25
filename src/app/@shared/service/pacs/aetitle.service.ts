import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {ApiResponseInterface} from '../../model/http/api-response-interface';
import {ApiResponsePaginated} from '../../model/http/api-response-paginated';
import {catchError, map} from "rxjs/operators";
import {PaginatedListInterface} from '../../model/http/paginated-list-interface';
import {Estudo} from '../../model/estudo/exame';
import {DcmQueryParams} from '../../dcm/query-params';
import {TagDicom} from "../../model/estudo/tag-dicom";
import {AETitleRepository} from "../../repository/aetitle.repository";
import {Aetitle} from "../../model/pacs/aetitle";

@Injectable({
    providedIn: 'root',
})
export class AetitleService {

    private apiUrl = `${environment.api_v1_base_url}`;

    constructor(
        private http: HttpClient,
        private aetitleRepository: AETitleRepository
    ) {
    }

    public create(aetitleData: Aetitle)
    {
        return this.aetitleRepository.createAETitle(aetitleData);
    }

    public query(queryParams: Record<string, any> | null = null): Observable<Aetitle[]>
    {
        return this.aetitleRepository.getAETitles(queryParams);
    }

    public queryAll(page: number = 1, page_size: number = 10, queryParams: Record<string, any> | null = null)
    {
        return this.aetitleRepository.query(page, page_size, queryParams);
    }




}
