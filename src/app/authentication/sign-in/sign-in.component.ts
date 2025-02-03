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
import {AuthService} from "../../@core/auth/auth.service";
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule, ReactiveFormsModule, NgIf],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
    isToggled = false;
    constructor(
        private fb: FormBuilder,
        private router: Router,
        public themeService: CustomizerSettingsService,
        private authService: AuthService,
        private snackBar: MatSnackBar

    ) {
        this.authForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(8)]],
            username: ['']
        });
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    hide = true;
    authForm: FormGroup;

    onSubmit() {
        if (this.authForm.valid) {
            this.authService.login(this.authForm.get('username')?.value, this.authForm.get('password')?.value)
                .subscribe({
                    next: (response) => {
                        if (this.authService.handleAuthentication(response)) {
                            this.router.navigate(['']);
                        }
                    },
                    error: (error) => {
                        this.snackBar.open('Erro no login', 'Fechar', {
                            duration: 4000, // tempo em milissegundos para fechar automaticamente
                            horizontalPosition: 'right', // 'start' | 'center' | 'end' | 'left' | 'right'
                            verticalPosition: 'bottom',      // 'top' | 'bottom'
                            panelClass: ['success-snackbar'] // Classe CSS personalizada

                        });
                        console.error('Erro no login', error);
                    }
                });
        } else {
            console.log('Formulário inválido. Verifique os campos.');
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
