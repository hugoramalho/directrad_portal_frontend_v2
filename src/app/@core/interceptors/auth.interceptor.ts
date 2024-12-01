// /**
//  Created by: Hugo Ramalho <ramalho.hg@gmail.com>

//  Created at: 09/04/2024
//  **/

// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { AuthService } from '../auth/auth.service';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {

//     constructor(public authService: AuthService) {}

//     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         let setHeaders: Record<string, any> = {};
//         const token :string|null = this.authService.getToken();
//         setHeaders['x-user-client'] = '1';
//         if (token) {
//             setHeaders['Authorization'] = `Bearer ${token}`;
//         }
//         request = request.clone({
//             setHeaders: setHeaders
//         });

//         return next.handle(request);
//     }
// }
