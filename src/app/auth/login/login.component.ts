/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 13/12/2024
 **/

import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { AuthService } from "../../@shared/service/auth/auth.service";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-login-component',
    standalone: true,
    imports: [RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule, ReactiveFormsModule, NgIf],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

    // isToggled
    isToggled = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public themeService: CustomizerSettingsService,
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) {
        this.authForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
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
                        duration: 3000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        panelClass: ['success-snackbar']
                    });
                    // this.router.navigate(['/home']);
                },
                error: () => {
                    this.snackBar.open('Falha na autenticação!', 'Fechar', {
                        duration: 3000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        panelClass: ['error-snackbar']
                    });
                }
            });
        }
    }

    // Dark Mode
    toggleTheme() {
        this.themeService.toggleTheme();
    }

    // Card Border
    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}
