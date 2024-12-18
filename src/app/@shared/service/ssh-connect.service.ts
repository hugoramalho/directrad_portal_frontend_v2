import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface SshConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    command?: string; // Comando opcional
}

@Injectable({
    providedIn: 'root',
})
export class SshConnectService {
    private apiUrl = 'http://localhost:3000/ssh'; // Ajuste para a URL do seu backend
    private isConnected = false;
    private outputSubject = new BehaviorSubject<string>('');
    public output$ = this.outputSubject.asObservable();

    constructor(private http: HttpClient) {}

    /**
     * Estabelece uma conexão SSH com o backend.
     * @param config Configuração do SSH.
     * @returns Observable de status de conexão.
     */
    connect(config: SshConfig): Observable<string> {
        const url = `${this.apiUrl}/connect`;
        return this.http.post<string>(url, config, this.getHttpOptions()).pipe(
            tap(() => {
                this.isConnected = true;
                this.outputSubject.next('Conexão estabelecida com o servidor SSH.');
            }),
            // catchError((err) => {
            //     this.outputSubject.next('Erro ao conectar: ' + err.message);
            //     throw err;
            // })
        );
    }

    /**
     * Envia um comando para o servidor SSH via backend.
     * @param command Comando a ser executado.
     * @returns Observable com a saída do comando.
     */
    sendCommand(command: string): Observable<string> {
        if (!this.isConnected) {
            this.outputSubject.next('Erro: Nenhuma conexão SSH ativa.');
            return new Observable<string>((subscriber) => {
                subscriber.complete();
            });
        }

        const url = `${this.apiUrl}/command`;
        return this.http
            .post<string>(url, { command }, this.getHttpOptions())
            .pipe(
                tap((response) => {
                    this.outputSubject.next(response);
                }),
                // catchError((err) => {
                //     this.outputSubject.next('Erro ao enviar comando: ' + err.message);
                //     throw err;
                // })
            );
    }

    /**
     * Encerra a conexão SSH com o backend.
     * @returns Observable de status de desconexão.
     */
    disconnect(): Observable<string> {
        if (!this.isConnected) {
            this.outputSubject.next('Erro: Nenhuma conexão ativa para desconectar.');
            return new Observable<string>((subscriber) => {
                subscriber.complete();
            });
        }

        const url = `${this.apiUrl}/disconnect`;
        return this.http.post<string>(url, {}, this.getHttpOptions()).pipe(
            tap(() => {
                this.isConnected = false;
                this.outputSubject.next('Conexão SSH encerrada.');
            }),
            // catchError((err) => {
            //     this.outputSubject.next('Erro ao desconectar: ' + err.message);
            //     throw err;
            // })
        );
    }

    /**
     * Retorna as opções HTTP padrão.
     */
    private getHttpOptions(): { headers: HttpHeaders } {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
    }
}
