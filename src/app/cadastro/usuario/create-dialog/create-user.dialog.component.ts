/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 21/03/2025
 **/

import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {RouterLink} from '@angular/router';
import {FileUploadModule} from '@iplab/ngx-file-upload';
import {CustomizerSettingsService} from '../../../customizer-settings/customizer-settings.service';
import {UserService} from "../../../@shared/service/usuario/user.service";
import {User} from "../../../@shared/model/usuario/user";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserGroups, UserGroupsMapper} from "../../../@shared/model/usuario/user-groups";
import {MatChip, MatChipListbox} from "@angular/material/chips";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {KeyValuePipe, NgIf} from "@angular/common";
import {BRAZILIAN_STATES_ORDERED} from "../../../@shared/model/utils/estados";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {UsersService} from "../../../@shared/service/usuario/users.service";
import {CreateUserService} from "../../../@shared/service/usuario/create-user.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {sameValueValidator} from "../../../@shared/validators/same-value.validator";
import {PasswordValidators} from "../../../@shared/validators/password.validator";

@Component({
    selector: 'app-account.ts-settings',
    standalone: true,
    templateUrl: './create-user.dialog.component.html',
    styleUrl: './create-user.dialog.component.scss',
    imports: [
        RouterLink,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        FileUploadModule,
        ReactiveFormsModule,
        FormsModule,
        MatChip,
        MatChipListbox,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        NgIf,
        MatSlideToggle,
        MatDialogActions,
        MatDialogContent,
        MatProgressSpinner,
        KeyValuePipe
    ]
})
export class CreateUserDialogComponent {
    protected readonly UserGroupsMapper = UserGroupsMapper;
    protected readonly UserGroups = UserGroups;
    protected readonly numericUserGroups = Object.entries(UserGroups)
        .filter(([key, value]) => typeof value === 'number')
        .map(([key, value]) => ({ key, value: value as number }));


    public multiple: boolean = false;
    isToggled = false;
    user: User | null = null;
    userForm: FormGroup;
    userGroups: string[];
    states = BRAZILIAN_STATES_ORDERED;
    currentPage: number = 1;
    isLoading: boolean = true;

    constructor(
        public themeService: CustomizerSettingsService,
        private userService: UserService,
        private createUserService: CreateUserService,
        private snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<CreateUserDialogComponent>,
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit() {
        this.isLoading = true;
        this.userForm = this.formBuilder.group({
            id: [''],
            username: [''],
            password: ['', [
                Validators.required,
                Validators.minLength(6),
                PasswordValidators.hasUpperAndLowerCase(),
                PasswordValidators.hasNumber(),
                PasswordValidators.hasSpecialCharacter()
            ]],
            password_repeat: [''],
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
            groups_ids: [''],
        }, {
            validators: [
                sameValueValidator('password', 'password_repeat'),
            ]
        });
        this.isLoading = false;
    }

    submit(): void {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched(); // força exibição dos erros
            return;
        }
        const user = new User(this.userForm.value);
        this.createUserService.create(user).subscribe({
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
