/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 19/03/2025
 **/

import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";

@Component({
    standalone: true,
    selector: 'app-create-host-proprio',
    templateUrl: './cadastro_client_host.dialog.component.html',
    imports: [
        FormsModule,
        MatButton,
        MatDialogContent,
        MatDialogActions,
        NgIf
    ]
})
export class CreateHostProprioComponent {
    pacsData = {
        hostType: 'host-proprio',
        nome: '',
        usaSSI: 'nao',
        enderecoIp: '',
        dominio: '',
        ipWorklist: '',
        portaWorklist: 3000,
        portaWado: 8090,
        portaApi: 3966,
        portaHttp: 80,
        portaHttps: 443,
        portaDicom: 11112,
        ramAlocada: '4GB',
        totalPools: 50,
        totalThreads: 100,
    };

    currentPage = 1;

    constructor(public dialogRef: MatDialogRef<CreateHostProprioComponent>) {}

    onCancel() {
        this.dialogRef.close();
    }

    goToNextPage() {
        this.currentPage = 2; // Simplesmente muda a página para exibir a segunda parte do formulário
    }

    save() {
        console.log('Salvando PACS:', this.pacsData);
        this.dialogRef.close(this.pacsData);
    }
}
