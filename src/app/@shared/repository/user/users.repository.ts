/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 18/03/2025
 **/


import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {ApiResponseInterface} from "../../model/http/api-response-interface";
import {environment} from "../../../../environments/environment";
import {UserAdmin} from "../../model/usuario/user-admin"

@Injectable({
    providedIn: 'root'
})
export class UsersRepository {
    private baseUrl = `${environment.api_v1_base_url}/users/admins`;
    private usersSubject = new BehaviorSubject<Map<number, UserAdmin>>(new Map());
    pacs$ = this.usersSubject.asObservable();

    constructor(private http: HttpClient) {
    }

    query(): Observable<UserAdmin[]> {
        const cachedUsersMap = this.usersSubject.getValue();
        if (cachedUsersMap.size > 0) {
            return of(Array.from(cachedUsersMap.values()));
        }
        return this.http.get<ApiResponseInterface<UserAdmin[]>>(`${this.baseUrl}`).pipe(
            map(response => response.data || []),
            tap((usersArray: UserAdmin[]) => {
                const usersMap = new Map<number, UserAdmin>();
                usersArray.forEach(user => usersMap.set(user.id, user));
                this.usersSubject.next(usersMap);
            }),
            catchError(err => {
                console.error('Erro ao obter Usuários:', err);
                return of([]);
            })
        );
    }
}
