/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 18/03/2025
 **/


import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {ApiResponseInterface} from "../../model/http/api-response-interface";
import {environment} from "../../../../environments/environment";
import {UserAdmin} from "../../model/usuario/user-admin"
import {User} from "../../model/usuario/user";
import {PaginatedListInterface} from "../../model/http/paginated-list-interface";
import {Aetitle} from "../../model/pacs/aetitle";
import {PaginatedList} from "../../model/http/paginated-list";
import {UserRis} from "../../model/usuario/user-ris";
import {ApiResponseResource} from "../../model/http/api-response-resource";
import {UserService} from "../../service/usuario/user.service";

@Injectable({
    providedIn: 'root'
})
export class UsersRepository {
    private baseUrl = `${environment.api_v1_base_url}/users`;
    private usersSubject = new BehaviorSubject<Map<number, UserAdmin>>(new Map());
    pacs$ = this.usersSubject.asObservable();

    constructor(
        private http: HttpClient,
        private userService: UserService,
    ) {
    }

    create(user: any): Observable<number>
    {
        return this.http.post<ApiResponseInterface<ApiResponseResource>>(
            `${this.baseUrl}`,
            user
        ).pipe(
            map(response => {
                return response.data.id;
            })
        );
    }

    queryAdminsPaginated(page: number = 1, page_size: number = 20, queryParams: Record<string, any> | null = null): Observable<UserAdmin[]> {
        const cachedUsersMap = this.usersSubject.getValue();
        if (cachedUsersMap.size > 0) {
            return of(Array.from(cachedUsersMap.values()));
        }
        let params = new HttpParams();
        if (queryParams) {
            Object.keys(queryParams).forEach((key) => {
                const value = queryParams[key];
                if (value !== null && value !== undefined && value !== '') {
                    params = params.set(key, value);
                }
            });
        }
        params = params.set('page', page.toString());
        params = params.set('page_size', page_size.toString());
        return this.http.get<ApiResponseInterface<UserAdmin[]>>(
            `${this.baseUrl}/admins`,
            {params}
        ).pipe(
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

    queryTeles(): Observable<UserRis[]>
    {
        return this.http.get<ApiResponseInterface<UserRis[]>>(
            `${this.baseUrl}/tele`
        ).pipe(
            map(response => response.data || []),
            catchError(err => {
                return of([]);
            })
        );
    }

    queryAdmins(): Observable<User[]>
    {
        return this.http.get<ApiResponseInterface<User[]>>(
            `${this.baseUrl}/admins`
        ).pipe(
            map(response => response.data || []),
            catchError(err => {
                console.error('Erro ao obter Usuários:', err);
                return of([]);
            })
        );
    }

    query(queryParams: Record<string, any> | null = null): Observable<User[]>
    {
        let params = new HttpParams();
        if (queryParams) {
            Object.keys(queryParams).forEach((key) => {
                const value = queryParams[key];
                if (value !== null && value !== undefined && value !== '') {
                    params = params.set(key, value);
                }
            });
        }
        return this.http.get<ApiResponseInterface<User[]>>(
            `${this.baseUrl}`,
            {params}
        ).pipe(
            map(
                response => response.data
            ),
            catchError(err => {
                return of([]);
            })
        );
    }

    queryPaginated(
        page: number = 1,
        page_size: number = 20,
        queryParams: Record<string, any> | null = null
    ): Observable<PaginatedList<User[]>>
    {
        let params = new HttpParams();
        if (queryParams) {
            Object.keys(queryParams).forEach((key) => {
                const value = queryParams[key];
                if (value !== null && value !== undefined && value !== '') {
                    params = params.set(key, value);
                }
            });
        }
        params = params.set('page', page.toString());
        params = params.set('page_size', page_size.toString());
        return this.http.get<ApiResponseInterface<PaginatedListInterface<User[]>>>(
            `${this.baseUrl}`,
            {params}
        ).pipe(
            map(response => new PaginatedList<User[]>(response.data)),
            catchError(err => {
                return of(new PaginatedList<User[]>({
                    total: 0,
                    count: 0,
                    page,
                    page_size: page_size,
                    items: []
                }));
            })
        );
    }
}
