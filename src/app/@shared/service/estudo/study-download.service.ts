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
import {StudyDownload} from "../../model/estudo/study-download";

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

    getDownloadInfo(pacs: Pacs | undefined, aetitle: Aetitle | undefined, estudo: Estudo) {
        if (!pacs || !aetitle) {
            return;
        }
        return this.http.get<ApiResponseInterface<StudyDownload>>(
            `${this.baseUrl}/pacs/${pacs.id}/aetitles/${aetitle.id}/studies/${estudo.StudyInstanceUID}/download/info`,
        ).pipe(
            map(response => response.data),
        );
    }

    onDonwloadInfo(pacs: Pacs | undefined, aetitle: Aetitle | undefined, estudo: Estudo): void {
        if (!pacs || !aetitle) {
            return;
        }
        let isLocal = false;
        this.http.get<ApiResponseInterface<StudyViewerRedirect>>(
            `${this.baseUrl}/pacs/${pacs.id}/aetitles/${aetitle.id}/studies/${estudo.StudyInstanceUID}/download?local=${isLocal}`,
        ).subscribe(response => {
            const viewerWindow = window.open(response.data.viewer_url, '_blank');
            if (viewerWindow) {
                viewerWindow.focus();
            }
        });
    }

    onDonwload(pacs: Pacs | undefined, aetitle: Aetitle | undefined, estudo: Estudo): void {
        if (!pacs || !aetitle) {
            return;
        }
        console.log(estudo);
        let isLocal = false;
        this.http.get<ApiResponseInterface<StudyViewerRedirect>>(
            `${this.baseUrl}/pacs/${pacs.id}/aetitles/${aetitle.id}/studies/${estudo.StudyInstanceUID}/viewer?local=${isLocal}`,
        ).subscribe(response => {
            const viewerWindow = window.open(response.data.viewer_url, '_blank');
            if (viewerWindow) {
                viewerWindow.focus();
            }
        });
    }

    onDonwloadMaxQuality(pacs: Pacs | undefined, aetitle: Aetitle | undefined, estudo: Estudo): void {
        if (!pacs || !aetitle) {
            return;
        }
        console.log(estudo);
        let isLocal = false;
        this.http.get<ApiResponseInterface<StudyViewerRedirect>>(
            `${this.baseUrl}/pacs/${pacs.id}/aetitles/${aetitle.id}/studies/${estudo.StudyInstanceUID}/viewer?local=${isLocal}`,
        ).subscribe(response => {
            const viewerWindow = window.open(response.data.viewer_url, '_blank');
            if (viewerWindow) {
                viewerWindow.focus();
            }
        });
    }

    // async healthCheck(): Promise<boolean> {
    //     try {
    //         const healthCheckResponse = await lastValueFrom(
    //             this.http.post<any>(`${this.site}/request`, {
    //                 type: 'health_check_url'
    //             })
    //         );
    //         if (healthCheckResponse?.success && healthCheckResponse?.info) {
    //             try {
    //                 // JSONP GET request simulando o comportamento do jQuery
    //                 const jsonpUrl = `${healthCheckResponse.info}?callback=JSONP_CALLBACK`;
    //
    //                 const jsonpResponse = await lastValueFrom(
    //                     this.http.jsonp<any>(jsonpUrl, 'JSONP_CALLBACK')
    //                         .pipe(
    //                             timeout(1000),
    //                             catchError((error: HttpErrorResponse) => {
    //                                 console.warn('Erro JSONP:', error);
    //                                 if (error.status === 200 || error.status === 404) {
    //                                     return of(true);
    //                                 }
    //                                 return of(false);
    //                             })
    //                         )
    //                 );
    //
    //                 return jsonpResponse === true || !!jsonpResponse;
    //             } catch (error) {
    //                 return false;
    //             }
    //         }
    //         return false;
    //     } catch (error) {
    //         return false;
    //     }
    // }
}
