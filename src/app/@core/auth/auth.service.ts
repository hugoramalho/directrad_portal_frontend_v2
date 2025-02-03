/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 28/03/2024
 **/

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService
{
    static readonly AUTH_TOKEN_KEY: string = "auth_token";
    static readonly USER_ID_KEY: string = "user_id";
    private loginUrl = `${environment.apiBaseUrl}/idp/auth/portal`;
    private tokenKey = 'auth_token';
    private userKey = 'user_id';

    constructor(
        private http: HttpClient,
        private router: Router
    )
    {
    }

    validarSenha(senha: string): boolean {
        const possuiLetra = /[a-zA-Z]/.test(senha);
        const possuiNumero = /\d/.test(senha);
        const possuiCaractereEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
        return possuiLetra && possuiNumero && possuiCaractereEspecial;
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post(
            this.loginUrl,
            {
                'username': username,
                'password': password
            },
            {
                headers: new HttpHeaders(
                    {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Client-App': 'PORTAL_PACS'
                    }
                ),
                // withCredentials: true // Importante para o envio de cookies (como CSRF tokens)
            }
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

    getUserId(): number | null {
        const userId = localStorage.getItem(AuthService.USER_ID_KEY);
        return userId ? parseInt(userId, 10) : null;
    }

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

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }
}
