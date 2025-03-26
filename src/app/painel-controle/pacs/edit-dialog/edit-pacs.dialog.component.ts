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
import {forkJoin} from "rxjs";
import {Aetitle} from "../../../@shared/model/pacs/aetitle";
import {UserTele} from "../../../@shared/model/usuario/user-tele";
import {UserAdmin} from "../../../@shared/model/usuario/user-admin";
import {UsersService} from "../../../@shared/service/usuario/users.service";
import {AetitleService} from "../../../@shared/service/pacs/aetitle.service";
import {MatIcon} from "@angular/material/icon";
import {TipoAetitle} from "../../../@shared/model/pacs/aetitle-type";
import {MatProgressSpinner} from "@angular/material/progress-spinner";


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
        ReactiveFormsModule,
        MatIcon,
        MatProgressSpinner
    ]
})
export class EditPacsDialogComponent {
    pacsForm!: FormGroup;
    isLoading = true;
    pacs_central = false;
    pacs_host = '';
    currentPage = 1;
    usarChaveSSH = false;
    aetitles: Aetitle[] = [];
    filteredStorageAetitles: Aetitle[] = [];
    filteredWorklistAetitles: Aetitle[] = [];
    adminUsers: UserAdmin[] = [];
    filteredAdminUsers: UserAdmin[] = [];
    teleUsers: UserTele[] = [];
    filteredTeleUsers: UserTele[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private pacsService: PacsService,
        private usersService: UsersService,
        private aetitleService: AetitleService,
        private dialogRef: MatDialogRef<EditPacsDialogComponent>,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public pacs: Pacs
    ) {
    }

    ngOnInit(): void {
        this.isLoading = true;
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
            aet_principal: [''],
            aet_worklist: [''],
            tele_id: [''],
            admin_id: [''],
            pacs_host_ssh_username: [''],
            pacs_host_ssh_port: [''],
            use_ssh_key: [''],
            pacs_host_ssh_password: [''],
            pacs_host_ssh_key: [''],
        });
        forkJoin({
            result1: this.aetitleService.query(),
            result2: this.usersService.queryAdmins(),
            result3: this.usersService.queryTeles(),
        }).subscribe({
            next: ({result1, result2, result3}) => {
                this.aetitles = result1;
                this.adminUsers = result2;
                this.filteredAdminUsers = result2;
                this.teleUsers = result3;
                this.filteredTeleUsers = result3;
                this.filteredWorklistAetitles = this.aetitles.filter(aetitle =>
                    aetitle.tipo == TipoAetitle.WORKLIST
                );
                this.filteredStorageAetitles = this.aetitles.filter(aetitle =>
                    aetitle.tipo == TipoAetitle.STORAGE
                );
                this.pacsForm.patchValue(this.pacs);
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
            }
        });
        this.pacs_central = this.pacs.tipo_pacs_application !== "PACS_CLIENTE";
        this.pacs_host = PacsHostMapper.getDescription(this.pacs.tipo_pacs_application as PacsHostType);
    }

    submit(): void {
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
            }
        });
    }

    //Edicao pacs host client:
    toggleSshInput() {
        this.usarChaveSSH = !this.usarChaveSSH;
    }


    //------------------------------------------------------------------------------------------------------------------
    onWorklistAetitlesSearch(value: string) {
        this.filteredWorklistAetitles = this.aetitles.filter(aetitle =>
            aetitle.tipo == TipoAetitle.WORKLIST &&
            aetitle.aetitle?.toLowerCase().includes(value.toLowerCase())
        );
    }
    onStorageAetitlesSearch(value: string) {
        this.filteredStorageAetitles = this.aetitles.filter(aetitle =>
            aetitle.tipo == TipoAetitle.STORAGE &&
            aetitle.aetitle?.toLowerCase().includes(value.toLowerCase())
        );
    }
    onTeleSearch(value: string) {
        this.filteredTeleUsers = this.teleUsers.filter(user =>
            user.full_name?.toLowerCase().includes(value.toLowerCase())
        );
    }
    onAdminSearch(value: string) {
        this.filteredAdminUsers = this.adminUsers.filter(user =>
            user.username?.toLowerCase().includes(value.toLowerCase())
        );
    }
    //------------------------------------------------------------------------------------------------------------------
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
    onCancel() {
        this.dialogRef.close();
    }
    //------------------------------------------------------------------------------------------------------------------


}
