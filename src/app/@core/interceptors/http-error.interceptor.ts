/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 09/04/2024
 **/

import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
// import { ErrorDialogComponent } from './error-dialog/error-dialog.component';  // Ajuste o caminho conforme necessário

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = 'Unknown error occurred';
                    if (error.error instanceof ErrorEvent) {
                        // Client-side error
                        errorMessage = `Error: ${error.error.message}`;
                    } else {
                        // Server-side error
                        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                    }
                    this.openErrorDialog(errorMessage);
                    return throwError(errorMessage);
                })
            );
    }

    private openErrorDialog(message: string): void {
        this.dialog.open(ErrorDialogComponent, {
            data: { message: message }
        });
    }
}
