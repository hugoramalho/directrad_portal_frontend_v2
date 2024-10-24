/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 25/03/2024
 **/

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Router } from '@angular/router';
// import { error } from 'console';
// import { environment } from '../../../../environments/environment';
//
//
// @Injectable({
//   providedIn: 'root',
// })
// export class ExtratoService {
//   private apiUrl = `${environment.apiBaseUrl}/api/v1/financeiro/lancamentos`;
//
//   constructor(private http: HttpClient) {}
//
//   // getUsuarios(): Observable<Usuario[]> {
//   //   return this.http.get<Usuario[]>(this.apiUrl);
//   // }
//
//
//   getUserId(): number | null {
//     const userId = localStorage.getItem('usuario_id');
//     return userId ? parseInt(userId, 10) : null;
//   }
//
//   clearUserData() {
//     localStorage.removeItem('auth_token');
//     localStorage.removeItem('usuario_id');
//   }
//
// }
