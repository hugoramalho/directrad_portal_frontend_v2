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
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RouterLink} from "@angular/router";
import {PacsCredentials} from "../../../@shared/model/pacs/pacs-credentials";
import {sameValueValidator} from "../../../@shared/validators/same-value.validator";
import {PasswordValidators} from "../../../@shared/validators/password.validator";
import {CustomizerSettingsService} from "../../../customizer-settings/customizer-settings.service";
import {PacsCredentialsService} from "../../../@shared/service/pacs/pacs-credentials.service";
import {Pacs} from "../../../@shared/model/pacs/pacs";



@Component({
    standalone: true,
    selector: 'app-pacs-credentials',
    templateUrl: './pacs-credentials.dialog.component.html',
    styleUrl: './pacs-credentials.dialog.component.scss',
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
export class PacsCredentialsDialogComponent
{
    credentialsForm!: FormGroup;
    loading = true;
    hidePassword: boolean = true;
    hasCredentials: boolean = false;
    pacsCredentials: PacsCredentials = {};
    isToggled: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private pacsCredentialsService: PacsCredentialsService,
        private dialogRef: MatDialogRef<PacsCredentialsDialogComponent>,
        private snackBar: MatSnackBar,
        public themeService: CustomizerSettingsService,
        @Inject(MAT_DIALOG_DATA) public pacs: Pacs
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void
    {
        this.hasCredentials = !!this.pacs.pacs_credentials_id;
        console.log(this.pacs.pacs_credentials_id);
        this.credentialsForm = this.formBuilder.group({
            id: [''],
            pacs_id: [this.pacs.id],
            pacs_password: [{value: '', disabled: true}],
            pacs_username: ['', [Validators.required]],
            pacs_new_password: ['',
                [
                    Validators.required,
                    Validators.minLength(6),
                    PasswordValidators.hasNumber(),
                ]
            ],
            pacs_new_password_repeat: ['', Validators.required]
        }, {
            validators: [
                sameValueValidator('new_password', 'new_password_repeat'),
            ]
        });
        if(this.hasCredentials) {
            this.pacsCredentials.id = this.pacs.pacs_credentials_id;
            this.pacsCredentials.pacs_id = this.pacs.id;
            this.pacsCredentialsService.find(this.pacsCredentials).subscribe(
                pacsCredentials => {
                    this.pacsCredentials = pacsCredentials;
                    this.credentialsForm.patchValue(pacsCredentials);
                }
            )
        }
    }

    private initializeForm(): void
    {

    }

    close(): void
    {
        this.dialogRef.close(false);
    }

    onCancel()
    {
        this.dialogRef.close();
    }

    onSubmit(): void
    {
        if (this.credentialsForm.invalid) {
            this.credentialsForm.markAllAsTouched(); // força exibição dos erros
            return;
        }
        this.pacsCredentialsService.update(
            this.credentialsForm.value as PacsCredentials
        ).subscribe({
            next: (response) => {
                this.snackBar.open('Credenciais editadas com sucesso', 'Fechar', {
                    duration: 4000,
                    horizontalPosition: 'right',
                    verticalPosition: 'bottom',
                    // panelClass: ['success-snackbar']
                });
                this.dialogRef.close(response);
            },
            error: (error) => {
                this.snackBar.open('Falha ao editar credenciais', 'Fechar', {
                    duration: 4000,
                    horizontalPosition: 'right',
                    verticalPosition: 'bottom',
                });
            }
        });
    }

    toggleTheme()
    {
        this.themeService.toggleTheme();
    }

    toggleCardBorderTheme()
    {
        this.themeService.toggleCardBorderTheme();
    }

    toggleRTLEnabledTheme()
    {
        this.themeService.toggleRTLEnabledTheme();
    }
}
