/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 23/03/2025
 **/


import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {PacsService} from "../../../@shared/service/pacs/pacs.service";
import {Pacs} from "../../../@shared/model/pacs/pacs";
import {PacsHostMapper, PacsHostType} from "../../../@shared/model/pacs/pacs-host-type";
import {UsersService} from "../../../@shared/service/usuario/users.service";
import {UserRis} from "../../../@shared/model/usuario/user-ris";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {forkJoin} from "rxjs";
import {User} from "../../../@shared/model/usuario/user";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatIcon} from "@angular/material/icon";

@Component({
    standalone: true,
    selector: 'app-create-pacs',
    styleUrls: ['./create-pacs.dialog.component.scss'],
    templateUrl: './create-pacs.dialog.component.html',
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
        MatOption,
        MatProgressSpinner,
        MatIcon,
    ]
})
export class CreatePacsDialogComponent {
    protected readonly PacsHostType = PacsHostType;
    habilitarCadastroAetitle: boolean = false;
    pacsForm: FormGroup;
    currentPage = 1;
    usarChaveSSH = false;
    teleUsers: UserRis[] = [];
    adminUsers: User[] = [];
    isLoading = true;
    filteredTeles: UserRis[] = [];
    filteredAdmins: User[] = [];

    constructor(
        public dialogRef: MatDialogRef<CreatePacsDialogComponent>,
        private formBuilder: FormBuilder,
        private pacsService: PacsService,
        private usersService: UsersService,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public tipo_pacs_application: PacsHostType
    ) {
    }

    ngOnInit() {
        this.isLoading = true;
        this.habilitarCadastroAetitle = false;
        forkJoin({
            result1: this.usersService.queryAdmins(),
            result2: this.usersService.queryTeles(),
        }).subscribe({
            next: ({result1, result2}) => {
                this.adminUsers = result1;
                this.filteredAdmins = result1;
                this.filteredTeles = result2;
                this.teleUsers = result2;
                this.isLoading = false;

                this.pacsForm = this.formBuilder.group({
                    tipo_pacs_application: ['', Validators.required],
                    identificacao: [''],
                    ip: [''],
                    dominio: [''],
                    worklist_ip: [''],
                    porta_wkl: [''],
                    porta_wado: [''],
                    porta_wado_local: [''],
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
                    sync_pacs_aetitle: [false],
                });
                this.pacsForm.get('tipo_pacs_application')?.setValue(
                    this.tipo_pacs_application
                );
            },
            error: (error) => {
                this.isLoading = false;
            }
        });
    }

//----------------------------------------------------------------------------------------------------------------------
    onTeleSearch(value: string) {
        this.filteredTeles = this.teleUsers.filter(user =>
            user.full_name?.toLowerCase().includes(value.toLowerCase())
        );
    }

    onAdminSearch(value: string) {
        this.filteredAdmins = this.adminUsers.filter(user =>
            user.username?.toLowerCase().includes(value.toLowerCase())
        );
    }

    toggleSshInput() {
        this.usarChaveSSH = !this.usarChaveSSH;
    }

    onCancel() {
        this.dialogRef.close();
    }

    goToNextPage() {
        if (this.currentPage < 2) {
            this.currentPage++;
        }
    }

    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    toggleCadastroAetitle() {
        this.habilitarCadastroAetitle = !this.habilitarCadastroAetitle;
        console.log('aquiiiii', this.habilitarCadastroAetitle);
    }

    submit(): void {
        if (this.pacsForm.invalid) {
            this.pacsForm.markAllAsTouched(); // força exibição dos erros
            return;
        }
        const pacsData = this.pacsForm.value as Pacs;
        this.pacsService.create(pacsData).subscribe({
            next: (response) => {
                this.snackBar.open('Pacs criado com sucesso', 'Fechar', {
                    duration: 4000,
                    horizontalPosition: 'right',
                    verticalPosition: 'bottom',
                    // panelClass: ['success-snackbar']
                });
                this.dialogRef.close(response);
            },
            error: (error) => {
                console.error('Erro ao criar PACS:', error);
            }
        });
    }

}
