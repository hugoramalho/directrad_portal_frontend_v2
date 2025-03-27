/**
    Created by: Hugo Ramalho <ramalho.hg@gmail.com>
    Created at: 18/08/2024
 **/

import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {HTTP_HEADERS} from '../constants/http-headers.constants';
import {catchError} from "rxjs/operators";
import {AuthService} from "../service/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private snackBar: MatSnackBar,
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const JWT = localStorage.getItem('auth_token');
        if (JWT) {
            const clonedRequest = request.clone({
                setHeaders: {
                    [HTTP_HEADERS.AUTH_TOKEN]: `Bearer ${JWT}`,
                    [HTTP_HEADERS.CLIENT_APP]: 'PACS'
                }
            });
            return next.handle(clonedRequest).pipe(
                catchError((error: HttpErrorResponse) => {
                    if ([401, 403].includes(error.status)) {
                        this.authService.logout();
                    }
                    let errorMessage = 'Unknown error occurred';
                    errorMessage = error.error instanceof ErrorEvent
                        ? error.error.message
                        : error.message;
                    this.snackBar.open(
                        errorMessage || 'Falha na requisição',
                        'Fechar',
                        {
                            duration: 10000,
                            horizontalPosition: 'right',
                            verticalPosition: 'bottom',
                            panelClass: ['success-snackbar']
                        }
                    );
                    return throwError(() => error);
                })
            )
        }
        // Se não houver token, apenas segue a requisição original
        return next.handle(request);
    }
}
