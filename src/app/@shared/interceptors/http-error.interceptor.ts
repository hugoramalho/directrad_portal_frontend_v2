/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 09/04/2024
 **/
/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 09/04/2024
 **/
import {Injectable} from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from "../service/auth/auth.service";
import {Router} from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(
        private dialog: MatDialog,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar,
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error.status);
                console.error('ERR', error)
                if (error.status === 401) {
                    this.authService.logout();
                    this.router.navigate(['/authentication']);
                    return throwError(() => new Error('Unauthorized'));
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
                return throwError(() => new Error(errorMessage));
            })
        );
    }
}
