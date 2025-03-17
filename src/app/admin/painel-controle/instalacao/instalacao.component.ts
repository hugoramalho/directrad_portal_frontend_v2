import { Component, OnInit, OnDestroy } from '@angular/core';
import { Terminal } from 'xterm';
import { SshConnectService, SshConfig } from '../../@shared/service/ssh-connect.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
    standalone: true,
    selector: 'app-ssh-terminal',
    templateUrl: 'instalacao.component.html',
    styleUrls: ['./instalacao.component.scss'],
    imports: [FormsModule, CommonModule, MatFormField, MatInput, MatLabel, ReactiveFormsModule, MatButton],
})
export class SshTerminalComponent implements OnInit, OnDestroy {
    private terminal: Terminal;
    command: string = '';
    sshConfig: SshConfig = {
        host: 'seu-servidor',
        port: 22,
        username: 'seu-usuario',
        password: 'sua-senha',
        command: '',
    };

    constructor(private sshService: SshConnectService) {}

    ngOnInit(): void {
        // Inicializa o terminal e configura a saída
        this.terminal = new Terminal();
        this.terminal.open(document.getElementById('terminal') as HTMLElement);

        // Observa as saídas do serviço SSH e exibe no terminal
        this.sshService.output$.subscribe((output) => {
            this.terminal.write(output + '\r\n');
        });

        // Conecta ao servidor SSH
        this.connect();
    }

    connect(): void {
        this.sshService.connect(this.sshConfig).subscribe({
            next: (message) => {
                this.terminal.write(message + '\r\n');
            },
            error: (err) => {
                this.terminal.write('Erro na conexão: ' + err.message + '\r\n');
            },
        });
    }

    sendCommand(): void {
        if (this.command.trim()) {
            this.sshService.sendCommand(this.command);
            this.terminal.write(`> ${this.command}\r\n`); // Exibe o comando no terminal
            this.command = ''; // Limpa o input
        }
    }

    disconnect(): void {
        this.sshService.disconnect();
        this.terminal.write('Desconectado do servidor.\r\n');
    }

    ngOnDestroy(): void {
        this.disconnect();
    }
}
