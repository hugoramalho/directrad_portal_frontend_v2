/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 19/03/2025
 **/

import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
    standalone: true,
    selector: 'app-create-host-proprio',
    styleUrls: ['./cadastro_client_host.dialog.component.scss'],
    templateUrl: './cadastro_client_host.dialog.component.html',
    imports: [
        FormsModule,
        MatButton,
        MatDialogContent,
        MatDialogActions,
        NgIf,
        ReactiveFormsModule,
        MatSlideToggle,
        MatLabel,
        MatFormField,
        MatInput,
        MatSelect,
        MatOption
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
    pacsForm: FormGroup;
    currentPage = 1;
    usarChaveSSH = false;

    constructor(
        public dialogRef: MatDialogRef<CreateHostProprioComponent>,
        private formBuilder: FormBuilder,
    ) {

    }

    ngOnInit()
    {
        this.pacsForm = this.formBuilder.group({
            identificacao: [''],
            ip: [''],
            dominio: [''],
            ip_worklist: [''],
            porta_worklist: [''],
            porta_wado: [''],
            porta_api: [''],
            porta_http: [''],
            porta_https: [''],
            porta_dicom: [''],
            config_ram: [''],
            config_threads_pool: [''],
            config_threads: [''],
            aetitle_storage_principal: [''],
            aetitle_worklist: [''],
            tele_id: [''],
            admin_id: [''],
            pacs_host_ssh_username: [''],
            pacs_host_ssh_port: [''],
            use_ssh_key: [''],
            pacs_host_ssh_password: [''],
            pacs_host_ssh_key: [''],
        });
    }

    toggleSshInput()
    {
        this.usarChaveSSH = !this.usarChaveSSH;
    }

    onCancel()
    {
        this.dialogRef.close();
    }

    goToNextPage()
    {
        if (this.currentPage < 2) {
            this.currentPage++;
        }
    }

    goToPreviousPage()
    {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    save()
    {
        console.log('Salvando PACS:', this.pacsData);
        this.dialogRef.close(this.pacsData);
    }
}
