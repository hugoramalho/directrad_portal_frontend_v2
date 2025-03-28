/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 28/03/2025
 **/


import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {from, Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {UserService} from "../usuario/user.service";
import {User} from "../../model/usuario/user";
import {catchError, map, switchMap} from "rxjs/operators";
import {AppInitializerService} from "../usuario/app-init.service";
import {Log} from "../../model/monitoramento/log";
import {ApiResponseInterface} from "../../model/http/api-response-interface";

@Injectable({
    providedIn: 'root'
})
export class LogsService
{
    private loginUrl = `${environment.api_v1_base_url}/monitoring`;

    constructor(
        private http: HttpClient,
        private userService: UserService,
    ) {
    }

    get(): Observable<Log[]> {
        return this.http.get<ApiResponseInterface<Log[]>>(
            `${this.loginUrl}/logs`,
        ).pipe(
            map(response => {
                return response?.data
            })
        );
    }
}
