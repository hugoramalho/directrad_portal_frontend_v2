/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 24/03/2025
 **/

import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {NgClass, NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../../@shared/model/usuario/user";
import {PasswordService} from "../../@shared/service/usuario/password.service";
import {CustomizerSettingsService} from "../../customizer-settings/customizer-settings.service";
import {RouterLink} from "@angular/router";
import {sameValueValidator} from "../../@shared/validators/same-value.validator";
import {PasswordValidators} from "../../@shared/validators/password.validator";
import {UserPasswordUpdate} from "../../@shared/model/usuario/user-password-update";


@Component({
    standalone: true,
    selector: 'app-change-user-password',
    templateUrl: './password-change.dialog.component.html',
    styleUrl: './password-change.dialog.component.scss',
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
        MatIconButton,
        RouterLink,
        MatError,
        MatSuffix,
        NgClass
    ]
})
export class ChangePasswordDialogComponent {
    passwordForm!: FormGroup;
    loading = true;
    hidePassword: boolean = true;
    isToggled: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private passwordService: PasswordService,
        private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
        private snackBar: MatSnackBar,
        public themeService: CustomizerSettingsService,
        @Inject(MAT_DIALOG_DATA) public user: User
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.passwordForm = this.formBuilder.group({
            user_id: [this.user.id],
            password: ['', [Validators.required]],
            new_password: ['',
                [
                    Validators.required,
                    Validators.minLength(6),
                    PasswordValidators.hasUpperAndLowerCase(),
                    PasswordValidators.hasNumber(),
                    PasswordValidators.hasSpecialCharacter()
                ]
            ],
            new_password_repeat: ['', Validators.required]
        }, {
            validators: [
                sameValueValidator('new_password', 'new_password_repeat'),
            ]
        });
    }

    close(): void {
        this.dialogRef.close(false);
    }

    onCancel() {
        this.dialogRef.close();
    }

    onSubmit(): void
    {
        if (this.passwordForm.invalid) {
            this.passwordForm.markAllAsTouched(); // força exibição dos erros
            return;
        }
        const passwordUpdateData = this.passwordForm.value as UserPasswordUpdate;
        this.passwordService.updatePassword(passwordUpdateData).subscribe({
            next: (response) => {
                this.snackBar.open('Senha alterada com sucesso', 'Fechar', {
                    duration: 4000,
                    horizontalPosition: 'right',
                    verticalPosition: 'bottom',
                    // panelClass: ['success-snackbar']
                });
                this.dialogRef.close(response);
            },
            error: (error) => {
                console.log(error);
                this.snackBar.open('Falha ao alterar senha', 'Fechar', {
                    duration: 4000,
                    horizontalPosition: 'right',
                    verticalPosition: 'bottom',
                });
            }
        });
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }
}
