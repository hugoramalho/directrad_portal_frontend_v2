import {Component, Inject} from '@angular/core';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent, MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField} from "@angular/material/form-field";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgSwitch, NgSwitchCase, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatLabel} from "@angular/material/form-field";
import {TipoAetitle} from "../../../@shared/model/pacs/aetitle-type";
import {forkJoin} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ClinicaService} from "../../../@shared/service/usuario/clinica.service";
import {AetitleService} from "../../../@shared/service/pacs/aetitle.service";
import {PacsService} from "../../../@shared/service/pacs/pacs.service";
import {UserClinica} from "../../../@shared/model/usuario/user-clinica";
import {Pacs} from "../../../@shared/model/pacs/pacs";
import {Aetitle} from "../../../@shared/model/pacs/aetitle";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../../@shared/service/usuario/user.service";
import {PacsNetwork} from "../../../@shared/model/pacs/network";
import {PacsNetworkService} from "../../../@shared/service/pacs/network.service";
import {MatIcon} from "@angular/material/icon";
import {User} from "../../../@shared/model/usuario/user";

@Component({
    standalone: true,
    selector: 'app-add-aetitle',
    templateUrl: './edit-aetitle.component.html',
    styleUrls: ['./edit-aetitle.component.scss'],
    imports: [
        MatFormField,
        FormsModule,
        MatOption,
        MatSelect,
        NgForOf,
        NgIf,
        NgSwitchCase,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        MatInput,
        MatSlideToggle,
        NgSwitch,
        MatDialogContent,
        MatDialogTitle,
        MatLabel,
        MatProgressSpinner,
        ReactiveFormsModule,
        MatIcon
    ]

})
export class EditAetitleComponent {
    protected readonly TipoAetitle = TipoAetitle;
    createNewExternalNetwork = false;
    isLoading: boolean = true;
    isSaving = false;
    aetitleForm: FormGroup;
    clinicas: UserClinica[] = [];
    filteredClinicas: UserClinica[] = [];
    pacsList: Pacs[] = [];
    filteredPacs: Pacs[] = [];
    aetitlesAccess: Aetitle[] = [];
    aetitlesAccessFiltered: Aetitle[] = [];
    externalNetworks: PacsNetwork[] = [];
    filteredExternalNetworks: PacsNetwork[] = [];
    cadastroAetitlePacs: boolean = true;

    constructor(
        public dialogRef: MatDialogRef<EditAetitleComponent>,
        private formBuilder: FormBuilder,
        private clinicaService: ClinicaService,
        private aetitleService: AetitleService,
        private pacsService: PacsService,
        private snackBar: MatSnackBar,
        private userService: UserService,
        private pacsNetworkService: PacsNetworkService,
        @Inject(MAT_DIALOG_DATA) public aetitle: Aetitle
    ) {
    }

    ngOnInit() {
        this.isLoading = true;
        this.aetitleForm = this.formBuilder.group({
            id: [this.aetitle.id, Validators.required],
            tipo: [this.aetitle.tipo, Validators.required],
            aetitle: ['', Validators.required],
            descricao: [''],
            pacs_id: [this.aetitle.pacs_id, Validators.required],
            clinica_id: [this.aetitle.clinica_id],
            access_control_aetitles_ids: [this.aetitle?.access_control_aetitles_ids],
            new_external_network: [false],
            sync_pacs_aetitle: [false],
            external_network_id: [''],
            external_network_name: [''],
            external_network_host: [''],
            external_network_port: [''],
        });
        forkJoin({
            result1: this.clinicaService.query(),
            result2: this.pacsService.query(),
            result3: this.aetitleService.query(),
            result4: this.pacsNetworkService.query(this.userService.getUser()?.pacs_id, {type: 'EXTERNAL'}),
        }).subscribe({
            next: ({result1, result2, result3, result4}) => {
                this.clinicas = result1;
                this.filteredClinicas = result1;
                this.pacsList = result2;
                this.filteredPacs = result2;
                this.aetitlesAccess = result3;
                this.aetitlesAccessFiltered = result3;
                this.externalNetworks = result4;
                this.filteredExternalNetworks = result4;
                this.aetitleForm.patchValue(this.aetitle);
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
            }
        });
    }

    onAetitleAccessSearch(value: string) {
        this.aetitlesAccessFiltered = this.aetitlesAccess.filter(aetitle =>
            aetitle.aetitle?.toLowerCase().includes(value.toLowerCase())
        );
    }

    onClinicaSearch(value: string) {
        this.filteredClinicas = this.clinicas.filter(clinica =>
            clinica.nome?.toLowerCase().includes(value.toLowerCase())
        );
    }

    onPacsSearch(value: string) {
        this.filteredPacs = this.pacsList.filter(pacs =>
            pacs.identificacao?.toLowerCase().includes(value.toLowerCase())
        );
    }

    onNetworksSearch(value: string) {
        this.filteredExternalNetworks = this.externalNetworks.filter(network =>
            network.name?.toLowerCase().includes(value.toLowerCase()) ||
            network.host?.toLowerCase().includes(value.toLowerCase())
        );
    }

    queryAetitles(pacsId: string | number) {
        this.aetitleService.query({pacs_id: pacsId}).subscribe(aetitles => {
            this.aetitlesAccess = aetitles;
            this.aetitlesAccessFiltered = aetitles;
        })
    }

    queryNetworks(pacsId: string | number) {
        this.pacsNetworkService.query(pacsId, {type: 'EXTERNAL'})
            .subscribe(networks => {
                this.externalNetworks = networks;
                this.filteredExternalNetworks = networks;
            });
    }

    toggleCreateNewExternalNetwork()
    {
        this.createNewExternalNetwork = !this.createNewExternalNetwork;
    }

    onSubmit(): void {
        if (this.aetitleForm.invalid) {
            this.aetitleForm.markAllAsTouched();
            return;
        }
        const pacsData = this.aetitleForm.value as Aetitle;
        this.isSaving = true;
        this.aetitleForm.disable();
        this.aetitleService.update(pacsData).subscribe({
            next: (response) => {
                this.snackBar.open('Aetitle atualizado com sucesso', 'Fechar', {
                    duration: 4000,
                    horizontalPosition: 'right',
                    verticalPosition: 'bottom',
                    // panelClass: ['success-snackbar']
                });
                this.isSaving = false;
                this.dialogRef.close(response);
            },
            error: (error) => {
                this.snackBar.open('Falha ao atualizar Aetitle', 'Fechar', {
                    duration: 4000,
                    horizontalPosition: 'right',
                    verticalPosition: 'bottom',
                    // panelClass: ['success-snackbar']
                });
                this.aetitleForm.enable();
                this.isSaving = false;
            }
        });
    }

    onCancel() {
        this.dialogRef.close();
    }

    toggleCadastroAetitlePacs() {
        this.cadastroAetitlePacs = !this.cadastroAetitlePacs;
    }
}
