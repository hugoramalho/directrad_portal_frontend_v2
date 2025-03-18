/**
    Created by: Hugo Ramalho <ramalho.hg@gmail.com>
    Created at: 18/08/2024
 **/

import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HTTP_HEADERS} from '../constants/http-headers.constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const JWT = localStorage.getItem('auth_token');
        if (JWT) {
            const clonedRequest = request.clone({
                setHeaders: {
                    [HTTP_HEADERS.AUTH_TOKEN]: `Bearer ${JWT}`,
                    [HTTP_HEADERS.CLIENT_APP]: 'PACS'
                }
            });
            // Envia a requisição clonada com o token
            return next.handle(clonedRequest);
        }
        // Se não houver token, apenas segue a requisição original
        return next.handle(request);
    }
}
