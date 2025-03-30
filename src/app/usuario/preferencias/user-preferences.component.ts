import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FileUploadModule} from '@iplab/ngx-file-upload';
import {CustomizerSettingsService} from '../../customizer-settings/customizer-settings.service';
import {UserService} from "../../@shared/service/usuario/user.service";
import {User} from "../../@shared/model/usuario/user";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgClass, NgIf} from "@angular/common";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {Aetitle} from "../../@shared/model/pacs/aetitle";
import {Pacs} from "../../@shared/model/pacs/pacs";
import {MatIcon} from "@angular/material/icon";
import {EmptyValuePipe} from "../../@shared/pipe/empty-value.pipe";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatMenu, MatMenuItem} from "@angular/material/menu";
import {MatPaginator} from "@angular/material/paginator";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
    standalone: true,
    selector: 'app-user-preferences',
    imports: [
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        FileUploadModule,
        ReactiveFormsModule,
        FormsModule,
        MatSlideToggle,
        NgClass,
        MatIcon,
        MatCard,
        MatCardContent,
        MatCardHeader,
        MatCardTitle,
    ],
    templateUrl: './user-preferences.component.html',
    styleUrl: './user-preferences.component.scss'
})
export class UserPreferencesComponent {
    habilitarEdicao: boolean = false;
    userForm!: FormGroup;
    isToggled = false;
    aetitles: Aetitle[] | any = null;
    pacsList: Pacs[];
    user: User | any;

    constructor(
        public themeService: CustomizerSettingsService,
        private userService: UserService,
        private snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit() {
        this.user = this.userService.getUser();
        this.userForm = this.formBuilder.group({
            id: [''],
            user_id: [''],
            default_pacs_id: [''],
            default_aetitle_id: [''],
            default_theme: [''],
        });
        this.userForm.patchValue(this.user.preferences ?? {});
        this.userForm.disable();
    }

    toggleHabilitarEdicao() {
        this.habilitarEdicao = !this.habilitarEdicao;
        console.log('this.habilitarEdicao', this.habilitarEdicao);
        this.habilitarEdicao ? this.userForm.enable() : this.userForm.disable();
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

    // Dark Mode
    toggleTheme(themeSelected: string) {
        if(themeSelected == 'LIGHT' && this.themeService.isDark()) {
            this.themeService.toggleTheme();
        }
        if(themeSelected == 'DARK' && !this.themeService.isDark()) {
            this.themeService.toggleTheme();
        }
    }
}
