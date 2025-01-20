// auth.effects.ts

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user.model';

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient
    ) {}

    // Efeito para tratar LOGIN
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login), // escuta a ação [Auth] Login
            switchMap(({ username, password }) =>
                // Chama a API. Exemplo: /api/login
                this.http.post<{ user: User; token: string }>('/api/login', { username, password }).pipe(
                    map(response => {
                        // se deu certo, dispara loginSuccess
                        return AuthActions.loginSuccess({
                            user: response.user,
                            token: response.token
                        });
                    }),
                    catchError(error => {
                        // se deu erro, dispara loginFailure
                        return of(AuthActions.loginFailure({ error }));
                    })
                )
            )
        )
    );

    saveToken$ = createEffect(() =>
            this.actions$.pipe(
                ofType(AuthActions.loginSuccess),
                tap(({ token }) => {
                    localStorage.setItem('token', token);
                })
            ),
        { dispatch: false } // pois não vamos disparar outra action
    );

    clearToken$ = createEffect(() =>
            this.actions$.pipe(
                ofType(AuthActions.logout),
                tap(() => {
                    localStorage.removeItem('token');
                })
            ),
        { dispatch: false }
    );

}
