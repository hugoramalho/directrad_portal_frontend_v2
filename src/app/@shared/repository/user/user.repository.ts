/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 24/03/2025
 **/


import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {ApiResponseInterface} from "../../model/http/api-response-interface";
import {environment} from "../../../../environments/environment";
import {UserAdmin} from "../../model/usuario/user-admin"
import {User} from "../../model/usuario/user";

@Injectable({
    providedIn: 'root'
})
export class UserRepository {
    private baseUrl = `${environment.api_v1_base_url}/users`;
    private usersSubject = new BehaviorSubject<Map<number, UserAdmin>>(new Map());

    constructor(
        private http: HttpClient
    ) {
    }

    update(user: User)
    {
        return this.http.put<ApiResponseInterface<User>>(
            `${this.baseUrl}/${user.id}`,
            user
        ).pipe(
            map(response => response.data),
            catchError(err => {
                return of(null as any);
            })
        );
    }
}
