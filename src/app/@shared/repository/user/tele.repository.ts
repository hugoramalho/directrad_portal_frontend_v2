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
import {UserTele} from "../../model/usuario/user-tele";
import {environment} from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class TeleRepository {
    private baseUrl = `${environment.api_v1_base_url}/users/ris/tele`;
    private teleUserSubject = new BehaviorSubject<Map<number, UserTele>>(new Map());
    pacs$ = this.teleUserSubject.asObservable();

    constructor(private http: HttpClient) {
    }

    get(): Observable<UserTele[]> {
        const cachedTeleUsersMap = this.teleUserSubject.getValue();
        if (cachedTeleUsersMap.size > 0) {
            return of(Array.from(cachedTeleUsersMap.values()));
        }
        return this.http.get<ApiResponseInterface<UserTele[]>>(`${this.baseUrl}`).pipe(
            map(response => response.data || []),
            tap((usersArray: UserTele[]) => {
                const usersMap = new Map<number, UserTele>();
                usersArray.forEach(userTele => usersMap.set(userTele.id, new UserTele(userTele)));
                this.teleUserSubject.next(usersMap);
            }),
            catchError(err => {
                console.error('Erro ao obter Usuários Tele:', err);
                return of([]);
            })
        );
    }
}
