

import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {RouterLink} from '@angular/router';
import {FileUploadModule} from '@iplab/ngx-file-upload';
import {CustomizerSettingsService} from '../../customizer-settings/customizer-settings.service';
import {UserService} from "../../@shared/service/usuario/user.service";
import {User} from "../../@shared/model/usuario/user";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserGroups, UserGroupsMapper} from "../../@shared/model/usuario/user-groups";
import {MatChip, MatChipListbox} from "@angular/material/chips";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {NgClass, NgIf} from "@angular/common";
import {BRAZILIAN_STATES_ORDERED} from "../../@shared/model/utils/estados";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {ChangePasswordDialogComponent} from "../password-change/password-change.dialog.component";

@Component({
    selector: 'app-account.ts-settings',
    standalone: true,
    imports: [RouterLink, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule, FileUploadModule, ReactiveFormsModule, FormsModule, MatChip, MatChipListbox, MatDatepicker, MatDatepickerInput, MatDatepickerToggle, NgIf, MatSlideToggle, NgClass],
    templateUrl: './account-settings.component.html',
    styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent {
    protected readonly UserGroupsMapper = UserGroupsMapper;
    habilitarEdicao: boolean = false;
    public multiple: boolean = false;
    isToggled = false;
    user: User | null = null;
    userForm: FormGroup;
    userGroups: string[];
    groupNames: { id: string; description: string }[];
    states = BRAZILIAN_STATES_ORDERED;
    canChangePassword: boolean = false;

    constructor(
        public themeService: CustomizerSettingsService,
        private userService: UserService,
        // private dialogRef: MatDialogRef<EditPacsDialogComponent>,
        private snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit() {
        this.user = this.userService.getUser();
        this.userGroups = this.user?.groups?.map(group => group.id) || [];
        this.canChangePassword = this.userService.verifyGroup(UserGroups.ADMIN) || this.userService.verifyGroup(UserGroups.PACS_ADMIN);
        this.userForm = this.formBuilder.group({
            id: [''],
            username: [''],
            email: [''],
            email_alternativo: [''],
            phone: [''],
            company: [''],
            nome_completo: [''],
            data_nascimento: [''],
            tipo_documento: [''],
            documento: [''],
            telefone_codigo_pais: ['55'],
            telefone_codigo_area: ['27'],
            telefone_numero: [''],
            endereco_cep: [''],
            endereco_logradouro: [''],
            endereco_numero: [''],
            endereco_bairro: [''],
            endereco_cidade: [''],
            endereco_estado: [''],
            endereco_pais: [''],
            groups_ids: [{value: this.userGroups, disabled: true}],
        });
        this.groupNames = this.user?.groups?.map(group => ({
            id: group.id,
            description: UserGroupsMapper.getDescription(group.group_id)
        })) || [];
        this.userForm.patchValue(this.user ?? {});
        this.userForm.disable();
    }

    openChangePasswordDialog()
    {
        this.dialog.open(ChangePasswordDialogComponent, {
            width: '400px',
            data: this.user as User
        }).afterClosed()
            .subscribe(result => {
            });
    }

    toggleHabilitarEdicao() {
        this.habilitarEdicao = !this.habilitarEdicao;
        this.habilitarEdicao ? this.userForm.enable() : this.userForm.disable();
        this.userForm.get('groups_ids')?.disable();
    }

    submit(): void {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched(); // força exibição dos erros
            return;
        }
        const user = new User(this.userForm.value);
        this.userService.update(user).subscribe({
            next: (response) => {
                this.snackBar.open('Usuário atualizado com sucesso', 'Fechar', {
                    duration: 4000,
                    horizontalPosition: 'right',
                    verticalPosition: 'bottom',
                    // panelClass: ['success-snackbar']
                });
            },
            error: (error) => {
                console.error('Erro ao atualizar usuário:', error);
            }
        });
    }

    onCancel() {
        // this.dialogRef.close();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    formatDateInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D+/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        if (value.length > 5) {
            value = value.slice(0, 5) + '/' + value.slice(5);
        }
        value = value.slice(0, 10);
        input.value = value;
    }

    validateAndSetDate(event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = input.value;
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!regex.test(value)) {
            this.userForm.get('data_nascimento')?.setErrors({invalidDate: true});
            return;
        }
        const [month, day, year] = value.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        if (
            date.getFullYear() !== year ||
            date.getMonth() + 1 !== month ||
            date.getDate() !== day
        ) {
            this.userForm.get('data_nascimento')?.setErrors({invalidDate: true});
            return;
        }
        this.userForm.patchValue({
            patient_birth_date: date,
        });
        this.userForm.get('data_nascimento')?.setErrors(null);
    }
}
