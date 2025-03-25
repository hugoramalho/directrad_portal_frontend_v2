import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {PacsService} from "../../../@shared/service/pacs/pacs.service";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Pacs} from "../../../@shared/model/pacs/pacs";
import {PacsHostMapper, PacsHostType} from "../../../@shared/model/pacs/pacs-host-type";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
    standalone: true,
    selector: 'app-create-host-central',
    templateUrl: './edit-pacs.dialog.component.html',
    styleUrl: './edit-pacs.dialog.component.scss',
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatFormField,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
        MatSlideToggle,
        NgIf,
        ReactiveFormsModule
    ]
})
export class EditPacsDialogComponent {
    pacsForm!: FormGroup;
    loading = true;
    pacs_central = false;
    pacs_host = '';
    currentPage = 1;
    usarChaveSSH = false;


    constructor(
        private formBuilder: FormBuilder,
        private pacsService: PacsService,
        private dialogRef: MatDialogRef<EditPacsDialogComponent>,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public pacs: Pacs
    ) {
    }

    ngOnInit(): void
    {
        this.pacsForm = this.formBuilder.group({
            id: [''],
            tipo_pacs_application: [this.pacs.tipo_pacs_application],
            identificacao: [''],
            ip: [''],
            dominio: [''],
            worklist_ip: [''],
            porta_wkl: [''],
            porta_wado: [''],
            porta_api: [''],
            porta_nginx: [''],
            porta_ssl: [''],
            porta_dicom: [''],
            pacs_ram_config: [''],
            tamanho_pool: [''],
            quantidade_threads: [''],
            aetitle_storage_principal: [''],
            aetitle_worklist: [''],
            tele_id: [''],
            admin_id: [''],
            pacs_host_ssh_username: [''],
            pacs_host_ssh_port: [''],
            use_ssh_key: [''],
            pacs_host_ssh_password: [''],
            pacs_host_ssh_key: [''],
        });        this.pacs_central = this.pacs.tipo_pacs_application !== "PACS_CLIENTE";
        this.pacs_host = PacsHostMapper.getDescription(this.pacs.tipo_pacs_application as PacsHostType);
        this.pacsForm.patchValue(this.pacs);
    }

    close(): void
    {
        this.dialogRef.close(false);
    }

    //Edicao pacs host client:
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
        // console.log('Salvando PACS:', this.pacsData);
        // this.dialogRef.close(this.pacsData);
    }

    submit(): void
    {
        if (this.pacsForm.invalid) {
            this.pacsForm.markAllAsTouched(); // força exibição dos erros
            return;
        }
        const pacsData = this.pacsForm.value as Pacs;
        this.pacsService.update(pacsData).subscribe({
            next: (response) => {
                this.snackBar.open('Pacs atualizado com sucesso', 'Fechar', {
                    duration: 4000,
                    horizontalPosition: 'right',
                    verticalPosition: 'bottom',
                    // panelClass: ['success-snackbar']
                });
                this.dialogRef.close(response); // você pode fechar passando o novo objeto criado
            },
            error: (error) => {
                console.error('Erro ao atualizar PACS:', error);
                // aqui você pode exibir um snackbar ou feedback visual
            }
        });
    }
}
