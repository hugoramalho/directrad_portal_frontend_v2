/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 29/03/2025
 **/


import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {ApiResponseInterface} from '../../model/http/api-response-interface';
import {catchError, map} from "rxjs/operators";
import {Estudo} from '../../model/estudo/exame';
import {UserService} from "../usuario/user.service";
import {StudyViewerRedirect} from "../../model/estudo/study-viewer-redirect";
import {Pacs} from "../../model/pacs/pacs";
import {Aetitle} from "../../model/pacs/aetitle";
import {StudyDownload, StudyDownloadSerie} from "../../model/estudo/study-download";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class EstudoDownloadService {
    private baseUrl = `${environment.api_v1_base_url}`;

    constructor(
        private http: HttpClient,
        public userService: UserService,
    ) {
    }

    getDownloadInfo(pacs: Pacs, aetitle: Aetitle, estudo: Estudo): Observable<StudyDownload> {
        return this.http.get<ApiResponseInterface<StudyDownload>>(
            `${this.baseUrl}/pacs/${pacs.id}/aetitles/${aetitle.id}/studies/${estudo.StudyInstanceUID}/download/info`,
        ).pipe(
            map(response => response.data),
        );
    }

    onDonwload(pacs: Pacs, aetitle: Aetitle, estudo: StudyDownload, queryParams: any): void {
        let params = new HttpParams();
        if (queryParams) {
            Object.keys(queryParams).forEach((key) => {
                const value = queryParams[key];
                if (value !== null && value !== undefined && value !== '') {
                    params = params.set(key, value);
                }
            });
        }
        this.http.post<ApiResponseInterface<StudyViewerRedirect>>(
            `${this.baseUrl}/pacs/${pacs.id}/aetitles/${aetitle.id}/studies/${estudo.study_uid}/download`,
            estudo,
            {params: params}
        ).subscribe(response => {
            const viewerWindow = window.open(response.data.file_url, '_blank');
            if (viewerWindow) {
                viewerWindow.focus();
            }
        });
    }

    onDownloadSerie(pacs: Pacs, aetitle: Aetitle, studyDownloadSerie: StudyDownloadSerie) {
        this.http.post<ApiResponseInterface<StudyDownloadSerie>>(
            `${this.baseUrl}/pacs/${pacs.id}/aetitles/${aetitle.id}/studies/${studyDownloadSerie.study_uid}/series/${studyDownloadSerie.uid}/download?uncompressed=false`,
            studyDownloadSerie
        ).subscribe({
            next: (response) => {
                const downloadWindow = window.open(response.data.file_url, '_blank');
                if (downloadWindow) {
                    downloadWindow.focus();
                }
            },
            error: (err) => {
                console.error('Erro:', err);
            }
        });
    }
}
