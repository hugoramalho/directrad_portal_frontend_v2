/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 31/03/2025
 **/


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
import {PacsService} from "../pacs/pacs.service";
import {AetitleService} from "../pacs/aetitle.service";
import {UserService} from "../usuario/user.service";
import {Aetitle} from "../../model/pacs/aetitle";
import {PaginatedList} from "../../model/http/paginated-list";
import {Pacs} from "../../model/pacs/pacs";
import {StudyDownload, StudyDownloadSerie} from "../../model/estudo/study-download";
import {StudySerie} from "../../model/estudo/study-serie";

@Injectable({
    providedIn: 'root',
})
export class StudySeriesService {

    private baseUrl = `${environment.api_v1_base_url}`;

    constructor(
        private http: HttpClient,
        public aetitleService: AetitleService,
        public pacsService: PacsService,
        public userService: UserService,
    ) {
    }

    getStudySeries(pacs: Pacs, aetitle: Aetitle, estudo: Estudo): Observable<StudyDownload> {
        return this.http.get<ApiResponseInterface<StudyDownload>>(
            `${this.baseUrl}/pacs/${pacs.id}/aetitles/${aetitle.id}/studies/${estudo.StudyInstanceUID}/series`,
        ).pipe(
            map(response => {
                return response.data;
            })
        );
    }

    deleteStudySeries(pacs: Pacs, aetitle: Aetitle, studySerie: StudyDownloadSerie): Observable<any> {
        return this.http.delete<ApiResponseInterface<StudyDownload>>(
            `${this.baseUrl}/pacs/${pacs.id}/aetitles/${aetitle.id}/studies/${studySerie.study_uid}/series/${studySerie.uid}`,
        ).pipe(
            map(response => {
                return response.data;
            })
        );
    }

}
