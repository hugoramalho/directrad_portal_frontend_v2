import {Component, Inject} from '@angular/core';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent, MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField} from "@angular/material/form-field";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
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

@Component({
    standalone: true,
    selector: 'app-add-aetitle',
    templateUrl: './create-aetitle.component.html',
    styleUrls: ['./create-aetitle.component.scss'],
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
export class CreateAetitleComponent {
    protected readonly TipoAetitle = TipoAetitle;
    createNewExternalNetwork = false;
    cadastroAetitlePacs: boolean = false;
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


    constructor(
        public dialogRef: MatDialogRef<CreateAetitleComponent>,
        private formBuilder: FormBuilder,
        private clinicaService: ClinicaService,
        private aetitleService: AetitleService,
        private pacsService: PacsService,
        private snackBar: MatSnackBar,
        private userService: UserService,
        private pacsNetworkService: PacsNetworkService,
        @Inject(MAT_DIALOG_DATA) public tipo_aetitle: TipoAetitle
    ) {
    }

    ngOnInit()
    {
        this.isLoading = true;
        this.aetitleForm = this.formBuilder.group({
            tipo: [this.tipo_aetitle],
            aetitle: [''],
            descricao: [''],
            pacs_id: [this.userService.getUser()?.pacs_id],
            clinica_id: [''],
            access_control_aetitles_ids: [''],
            new_external_network: [false],
            external_network_id: [''],
            external_network_name: [''],
            external_network_host: [''],
            external_network_port: [''],
            pacs_register: [false],
        });
        forkJoin({
            result1: this.clinicaService.query(),
            result2: this.pacsService.query(),
            result3: this.aetitleService.query(),
            result4: this.pacsNetworkService.query(this.userService.getUser()?.pacs_id, {type: 'EXTERNAL'})
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
                this.isLoading = false;
            },
            error: (error) => {
                this.snackBar.open('Falha ao carregar dados', 'Fechar', {
                    duration: 4000,
                    horizontalPosition: 'right',
                    verticalPosition: 'bottom',
                });
            }
        });
    }

    onAetitleAccessSearch(value: string)
    {
        this.aetitlesAccessFiltered = this.aetitlesAccess.filter(aetitle =>
            aetitle.aetitle?.toLowerCase().includes(value.toLowerCase())
        );
    }

    onClinicaSearch(value: string)
    {
        this.filteredClinicas = this.clinicas.filter(clinica =>
            clinica.nome?.toLowerCase().includes(value.toLowerCase())
        );
    }

    onPacsSearch(value: string)
    {
        this.filteredPacs = this.pacsList.filter(pacs =>
            pacs.identificacao?.toLowerCase().includes(value.toLowerCase())
        );
    }

    onNetworksSearch(value: string)
    {
        this.filteredExternalNetworks = this.externalNetworks.filter(network =>
            network.name?.toLowerCase().includes(value.toLowerCase()) ||
            network.host?.toLowerCase().includes(value.toLowerCase())
        );
    }

    queryAetitles(pacsId: string | number)
    {
        this.aetitleService.query({pacs_id: pacsId}).subscribe(aetitles => {
            this.aetitlesAccess = aetitles;
            this.aetitlesAccessFiltered = aetitles;
        })
    }

    queryNetworks(pacsId: string | number)
    {
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

    toggleCadastroAetitlePacs() {
        this.cadastroAetitlePacs = !this.cadastroAetitlePacs;
    }

    submit(): void
    {
        if (this.aetitleForm.invalid) {
            this.aetitleForm.markAllAsTouched();
            return;
        }
        const pacsData = this.aetitleForm.value as Aetitle;
        this.isSaving = true;
        this.aetitleForm.disable();
        this.aetitleService.create(pacsData).subscribe({
            next: (response) => {
                this.snackBar.open('Aetitle criado com sucesso', 'Fechar', {
                    duration: 4000,
                    horizontalPosition: 'right',
                    verticalPosition: 'bottom',
                    // panelClass: ['success-snackbar']
                });
                this.isSaving = false;
                this.dialogRef.close(response);
            },
            error: (error) => {
                this.snackBar.open('Falha ao criar Aetitle', 'Fechar', {
                    duration: 4000,
                    horizontalPosition: 'right',
                    verticalPosition: 'bottom',
                });
                this.isSaving = false;
            }
        });
    }

    onCancel() {
        this.dialogRef.close();
    }
}
