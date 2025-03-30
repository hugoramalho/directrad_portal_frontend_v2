import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {CustomizerSettingsService} from '../../customizer-settings/customizer-settings.service';
import {AuthService} from "../../@shared/service/auth/auth.service";
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-sign-in-patient',
    standalone: true,
    imports: [
        RouterLink,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        NgIf
    ],
    templateUrl: './sign-in-patient.component.html',
    styleUrl: './sign-in-patient.component.scss'
})
export class SignInPatientComponent {
    isToggled = false;
    constructor(
        private fb: FormBuilder,
        private router: Router,
        public themeService: CustomizerSettingsService,
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) {
        this.authForm = this.fb.group({
            codigo_acesso: ['', [Validators.required, Validators.minLength(8)]],
            data_nascimento: ['']
        });
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }
    hide = true;
    authForm: FormGroup;
    onSubmit(): void {
        if (this.authForm.valid) {
            this.authService.login(
                this.authForm.value.username,
                this.authForm.value.password
            ).subscribe({
                next: () => {
                    this.snackBar.open('Login realizado com sucesso!', 'Fechar', {
                        duration: 4000,
                        horizontalPosition: 'right',
                        verticalPosition: 'bottom',
                        panelClass: ['success-snackbar']
                    });
                    this.router.navigate(['/']);
                },
                error: () => {
                    this.snackBar.open('Falha na autenticação!', 'Fechar', {
                        duration: 4000,
                        horizontalPosition: 'right',
                        verticalPosition: 'bottom',
                        panelClass: ['error-snackbar']
                    });
                }
            });
        }
    }

    toggleTheme() {
        console.log('this.isToggled', this.themeService.isToggled$);
        this.themeService.toggleTheme();
    }

    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }
}
