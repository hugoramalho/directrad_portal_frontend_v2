// /**
//  Created by: Hugo Ramalho <ramalho.hg@gmail.com>
//
//  Created at: 02/04/2024
//  **/
//
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, BehaviorSubject } from 'rxjs';
// import {tap} from 'rxjs/operators';
// import {UserService} from "../usuario/user.service";
//
// @Injectable({
//   providedIn: 'root',
// })
// export class ConfiguracoesService {
//   private config: any = {};
//   private utilizacao: any = {};
//
//   private utilizacaoObserver = new BehaviorSubject<void>(null);
//
//   constructor(
//     private http: HttpClient,
//     private usuariosService: UserService
//   ) {}
//
//   setConfigUtilizacao(): void {
//     this.config = this.usuariosService.usuario.config.mdweb || {};
//     this.utilizacao = this.usuariosService.usuario.dados-cadastro.config;
//   }
//
//   addObserverUtilizacao(observer: () => void): void {
//     this.utilizacaoObserver.subscribe(observer);
//   }
//
//   getConfig<T>(key: string, defaultValue: T): T {
//     const config = this.config[key] === undefined ? { ...defaultValue } : { ...defaultValue, ...this.config[key] };
//     this.config[key] = { ...config };
//     return config;
//   }
//
//   updateConfig<T>(key: string, value: T): Observable<any> {
//     if (this.config[key] === undefined) {
//       throw new Error('Chave ' + key + ' de configuração inexistente');
//     }
//
//     if (JSON.stringify(this.config[key]) === JSON.stringify(value)) {
//       return new Observable(observer => observer.complete());
//     }
//
//     this.config[key] = { ...value };
//
//     return this.http.put('/apiweb/atualizarConfig', { config: this.config }).pipe(
//       tap(() => {
//         this.utilizacaoObserver.next();
//       }),
//     );
//   }
// }
