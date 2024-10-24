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
export class AuthService {
    private loginUrl = `${environment.apiBaseUrl}/cliente/login`;

    private isLoggedIn = false;


    constructor(private http: HttpClient, private router: Router) {
    }

    validarSenha(senha: string): boolean {
        const possuiLetra = /[a-zA-Z]/.test(senha);
        const possuiNumero = /\d/.test(senha);
        const possuiCaractereEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

        return possuiLetra && possuiNumero && possuiCaractereEspecial;
    }


    login(email: string, senha: string): Observable<any> {
        let credentials = {'email': email, 'senha_acesso': senha}

        return this.http.post(this.loginUrl, credentials, {
            headers: new HttpHeaders({'Content-Type': 'application/json'}),
            // withCredentials: true // Importante para o envio de cookies (como CSRF tokens)
        });
    }

    handleAuthentication(data: any): void {
        if (data.token) {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('usuario_id', data.usuario_id.toString());

        } else {
            console.error('Token não presente na resposta');
            // Você pode implementar uma lógica adicional aqui para tratar esse caso.
        }
        this.isLoggedIn = true;
        this.router.navigate(['/home']);
    }

    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    getUserId(): number | null {
        const userId = localStorage.getItem('usuario_id');
        return userId ? parseInt(userId, 10) : null;
    }

    clearUserData() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('usuario_id');
    }

}
