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
import {AetitleService} from "../../../@shared/service/pacs/aetitle.service";
import {ClinicaService} from "../../../@shared/service/usuario/clinica.service";
import {PacsService} from "../../../@shared/service/pacs/pacs.service";
import {forkJoin} from "rxjs";
import {UserTele} from "../../../@shared/model/usuario/user-tele";
import {UserClinica} from "../../../@shared/model/usuario/user-clinica";
import {Aetitle} from "../../../@shared/model/pacs/aetitle";
import {Pacs} from "../../../@shared/model/pacs/pacs";
import {MatIconModule} from "@angular/material/icon";
import {StatusVerificacaoContato} from "../../../@shared/model/usuario/status-contact-verification";

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
        KeyValuePipe,
        MatIconModule
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
    aetitles: Aetitle[] = [];
    filteredAetitles: Aetitle[] = [];
    teleUsers: UserTele[] = [];
    filteredTeleUsers: UserTele[] = [];
    pacsList: Pacs[] = [];
    filteredPacsList: Pacs[] = [];
    clinicas: UserClinica[] = [];
    filteredClinicas: UserClinica[] = [];


    constructor(
        public themeService: CustomizerSettingsService,
        private aetitleService: AetitleService,
        private pacsService: PacsService,
        private usersService: UsersService,
        private clinicaService: ClinicaService,
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
        forkJoin({
            result1: this.aetitleService.query(),
            result2: this.clinicaService.query(),
            result3: this.pacsService.query(),
            result4: this.usersService.queryTeles()
        }).subscribe({
            next: ({result1, result2, result3, result4}) => {
                this.aetitles = result1;
                this.clinicas = result2;
                this.filteredClinicas = result2;
                this.pacsList = result3;
                this.filteredPacsList = result3;
                this.teleUsers = result4;
                this.filteredTeleUsers = result4;
                this.userForm = this.formBuilder.group({
                    id: [''],
                    username: ['',[
                        Validators.required,
                        Validators.minLength(6)]
                    ],
                    password: ['', [
                        Validators.required,
                        Validators.minLength(6),
                        PasswordValidators.hasUpperAndLowerCase(),
                        PasswordValidators.hasNumber(),
                        PasswordValidators.hasSpecialCharacter()]
                    ],
                    password_repeat: ['', [
                        Validators.required
                    ]],
                    company: ['', [
                        Validators.required,
                        Validators.minLength(6),
                    ]],
                    pacs_id: ['', [
                        Validators.required,
                    ]],
                    aetitle_id: ['', [
                        Validators.required,
                    ]],
                    clinica_id: ['', [
                        Validators.required,
                    ]],
                    tele_id: ['', [
                        Validators.required,
                    ]],
                    contato: this.formBuilder.group({
                        email_principal: this.formBuilder.group({
                            email: ['', [
                                Validators.required,
                                Validators.email,
                            ]],
                            status_verificacao: [StatusVerificacaoContato.NAO_VERIFICADO],
                            verificado_em: [null]
                        }),
                        email_alternativo: this.formBuilder.group({
                            email: ['', [
                                Validators.email,
                            ]],
                            status_verificacao: [StatusVerificacaoContato.NAO_VERIFICADO],
                            verificado_em: [null]
                        }),
                        telefone_principal: this.formBuilder.group({
                            codigo_pais: ['55', [
                                Validators.maxLength(45),

                            ]],
                            codigo_area: ['27', [
                                Validators.maxLength(45),

                            ]],
                            numero: ['',[
                                Validators.maxLength(45)
                            ]],
                            status_verificacao: [StatusVerificacaoContato.NAO_VERIFICADO]
                        }),
                    }),
                    pessoa: this.formBuilder.group({
                        nome_completo: ['', [
                            Validators.required,
                            Validators.maxLength(45),

                        ]],
                        data_nascimento: ['', [
                            Validators.maxLength(45),

                        ]],
                        tipo_documento: ['', [
                            Validators.maxLength(45),

                        ]],
                        documento: ['', [
                            Validators.maxLength(45),

                        ]]
                    }),
                    endereco: this.formBuilder.group({
                        cep: ['', [
                            Validators.maxLength(45),
                        ]],
                        logradouro: ['', [
                            Validators.maxLength(256),
                        ]],
                        numero: ['', [
                            Validators.maxLength(10),
                        ]],
                        bairro: ['', [
                            Validators.maxLength(180),
                        ]],
                        cidade: ['', [
                            Validators.maxLength(100),
                        ]],
                        estado: ['', [
                            Validators.maxLength(10),
                        ]],
                        complemento: ['',[
                            Validators.maxLength(256),
                        ]],
                    }),
                    group: this.formBuilder.group({
                        group_id: ['', [
                            Validators.required,
                        ]],
                        user_id: [null]
                    }),
                    permissions: this.formBuilder.group({
                        enable_create_access: [false, [
                            Validators.required,
                        ]],
                        enable_delete_exam: [false, [
                            Validators.required,
                        ]],
                        enable_link_ris: [false, [
                            Validators.required,
                        ]],
                        enable_export_exam: [false, [
                            Validators.required,
                        ]],
                        enable_merge: [false, [
                            Validators.required,
                        ]],
                        enable_group_selected_exams: [false, [
                            Validators.required,
                        ]],
                        enable_delete_series: [false, [
                            Validators.required,
                        ]],
                        enabled_modalities: [[null], [
                            Validators.required,
                        ]],
                        enable_edit_study: [false, [
                            Validators.required,
                        ]],
                    })
                }, {
                    validators: [
                        sameValueValidator('password', 'password_repeat'),
                    ]
                });
                this.userForm.get('pacs_id')?.valueChanges.subscribe(pacsId => {
                    this.filteredAetitles = this.aetitles.filter(aet => aet.pacs_id === pacsId);
                    this.userForm.get('aetitle_id')?.reset();
                });
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
            }
        });
    }

    submit(): void {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched(); // força exibição dos erros
            return;
        }
        // const user = new User(this.userForm.value);
        this.createUserService.create(this.userForm.value).subscribe({
            next: (response) => {
                this.snackBar.open('Usuário cadastradi com sucesso', 'Fechar', {
                    duration: 4000,
                    horizontalPosition: 'right',
                    verticalPosition: 'bottom',
                    // panelClass: ['success-snackbar']
                });
                this.dialogRef.close(response);
            },
            error: (error) => {
                console.error('Erro ao cadastrar usuário:', error);
            }
        });
    }

    //------------------------------------------------------------------------------------------------------------------
    onTeleSearch(value: string) {
        this.filteredTeleUsers = this.teleUsers.filter(user =>
            user.username?.toLowerCase().includes(value.toLowerCase()) ||
            user.full_name?.toLowerCase().includes(value.toLowerCase())
        );
    }
    onClinicasSearch(value: string) {
        this.filteredClinicas = this.clinicas.filter(clinica =>
            clinica.nome?.toLowerCase().includes(value.toLowerCase()) ||
            clinica.nome_razao?.toLowerCase().includes(value.toLowerCase())
        );
    }
    onPacsSearch(value: string) {
        this.filteredPacsList = this.pacsList.filter(pacs =>
            pacs.identificacao?.toLowerCase().includes(value.toLowerCase())
        );
    }
    onAetitlesSearch(value: string) {
        this.filteredAetitles = this.aetitles.filter(aetitle =>
            this.userForm.get('pacs_id')?.value == aetitle.pacs_id &&
            aetitle.aetitle?.toLowerCase().includes(value.toLowerCase())
        );
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
        const [day, month, year] = value.split('/').map(Number);
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
}
