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
import {PaginatedList} from "../../model/http/paginated-list";
import {UserService} from "../usuario/user.service";
import {PacsHostType} from "../../model/pacs/pacs-host-type";
import {UserGroups} from "../../model/usuario/user-groups";

@Injectable({
    providedIn: 'root',
})
export class AetitleService {

    private apiUrl = `${environment.api_v1_base_url}`;

    constructor(
        private http: HttpClient,
        private aetitleRepository: AETitleRepository,
        private userService: UserService,
    ) {
    }

    public create(aetitleData: Aetitle)
    {
        return this.aetitleRepository.create(aetitleData);
    }

    public update(aetitleData: Aetitle)
    {
        return this.aetitleRepository.update(aetitleData);
    }

    public query(queryParams: Record<string, any> | null = null): Observable<Aetitle[]>
    {
        return this.aetitleRepository.getAETitles(queryParams).pipe(
            map(aetitles => {
                return aetitles.filter(aetitle => {
                    if(!this.userService.verifyGroup(UserGroups.ADMIN)) {
                        return aetitle.pacs_id == this.userService.getUser()?.pacs_id;
                    }
                    return true;
                })
            })
        );
    }


    public queryPaginated(page: number = 1, page_size: number = 10, queryParams: Record<string, any> | null = null)
    {
        return this.aetitleRepository.query(page, page_size, queryParams);
    }

    search(
        allAetitles: Aetitle[],
        page: number = 1,
        pageSize: number = 10,
        filters: Record<string, any> = {}
    ): PaginatedList<Aetitle[]> {
        let filtered = [...allAetitles];

        Object.entries(filters).forEach(([key, value]) => {
            if (value && typeof value === 'string') {
                filtered = filtered.filter(aet =>
                    (aet[key as keyof Aetitle] ?? '').toString().toLowerCase().includes(value.toLowerCase())
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
