/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 28/03/2024
 **/

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {from, Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {UserService} from "../usuario/user.service";
import {User} from "../../model/usuario/user";
import {catchError, switchMap} from "rxjs/operators";
import {AppInitializerService} from "../usuario/app-init.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService
{
    static readonly AUTH_TOKEN_KEY: string = "auth_token";
    static readonly USER_ID_KEY: string = "user_id";
    // private loginUrl = `${environment.api_v1_base_url}/idp/auth/portal`;
    private loginUrl = `${environment.api_v1_base_url}/login`;
    private tokenKey = 'auth_token';
    private userKey = 'user_id';

    constructor(
        private http: HttpClient,
        private router: Router,
        private userService: UserService,
        private appInitializer: AppInitializerService
    ) {
    }

    validarSenha(senha: string): boolean {
        const possuiLetra = /[a-zA-Z]/.test(senha);
        const possuiNumero = /\d/.test(senha);
        const possuiCaractereEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
        return possuiLetra && possuiNumero && possuiCaractereEspecial;
    }

    login(username: string, password: string): Observable<void> {
        return this.http.post<{ success: boolean; data: { token: string; user: any } }>(
            this.loginUrl,
            {username, password},
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'X-Client-App': 'PORTAL_PACS'
                })
            }
        ).pipe(
            switchMap(response => {
                this.setToken(response.data.token);
                this.userService.setUser(response.data.user);
                // Converte a Promise<void> em um Observable<void>
                return from(this.appInitializer.initializeApp());
            }),
            catchError(error => {
                console.error('Erro no login:', error);
                return of(); // Retorna um Observable vazio para evitar quebra do fluxo
            })
        );
    }

    handleAuthentication(response: any): boolean {
        if (response.success) {
            localStorage.setItem(this.tokenKey, response.data.jwt);
            // localStorage.setItem(this.userKey, data.usuario_id.toString());
            return true;
        }
        return false;
    }

    public getUser(): User | null
    {
        return this.userService.getUser();
    }

    // getUserId(): number | null {
    //     const userId = localStorage.getItem(AuthService.USER_ID_KEY);
    //     return userId ? parseInt(userId, 10) : null;
    // }

    clearUserData() {
        localStorage.removeItem(AuthService.AUTH_TOKEN_KEY);
        localStorage.removeItem(AuthService.USER_ID_KEY);
    }


    isAuthenticated(): boolean {
        return !!localStorage.getItem(this.tokenKey);
    }

    setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    logout(): void
    {
        localStorage.removeItem(this.tokenKey);
        this.router.navigate(['/authentication']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }


}
