import {Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDialog} from "@angular/material/dialog";
import {Aetitle} from "../../@shared/model/pacs/aetitle";
import {CustomizerSettingsService} from "../../customizer-settings/customizer-settings.service";
import {CreateAetitleComponent} from "./create-dialog/create-aetitle.component";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {AetitleService} from "../../@shared/service/pacs/aetitle.service";
import {forkJoin} from "rxjs";
import {ClinicaService} from "../../@shared/service/usuario/clinica.service";
import {PacsService} from "../../@shared/service/pacs/pacs.service";
import {UserClinica} from "../../@shared/model/usuario/user-clinica";
import {Pacs} from "../../@shared/model/pacs/pacs";
import {PaginatedList} from "../../@shared/model/http/paginated-list";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {EditPacsDialogComponent} from "../pacs/edit-dialog/edit-pacs.dialog.component";
import {PacsSyncStatus, PacsSyncStatusMapper} from "../../@shared/model/pacs/status-sync";
import {TipoAetitle, TipoAetitleMapper} from "../../@shared/model/pacs/aetitle-type";
import {DateFormatPipe} from "../../@shared/pipe/date.pipe";
import {DatetimeFormatPipe} from "../../@shared/pipe/datetime.pipe";
import {SelectPacsTypeComponent} from "../pacs/cadastro-dialog/pacs-type-choice.dialog.component";
import {CreatePacsDialogComponent} from "../pacs/cadastro-dialog/create-pacs.dialog.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SelectCreateAetitleTypeComponent} from "./create-dialog/aetitle-choice.dialog.component";
import {UserGroups} from "../../@shared/model/usuario/user-groups";
import {UserService} from "../../@shared/service/usuario/user.service";
import {MatIcon} from "@angular/material/icon";
import {EmptyValuePipe} from "../../@shared/pipe/empty-value.pipe";
import {unknownValuePipe} from "../../@shared/pipe/unknown-value";
import {EditAetitleComponent} from "./edit-dialog/edit-aetitle.component";


@Component({
    standalone: true,
    selector: 'app-painel-aetitle',
    imports: [
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        RouterLink,
        MatTableModule,
        NgIf,
        MatIcon,
        MatCheckboxModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginator,
        MatProgressSpinner,
        DateFormatPipe,
        DatetimeFormatPipe,
        ReactiveFormsModule,
        EmptyValuePipe,
        unknownValuePipe
    ],
    templateUrl: './aetitle.component.html',
    styleUrl: './aetitle.component.scss'
})
export class CadastroAetitleComponent {
    isAdmin: boolean = false;
    isLoading: boolean = true;
    searchForm: FormGroup;
    classApplied = false;
    isToggled = false;
    currentLength: number = 0;
    dataSource = new MatTableDataSource<Aetitle>([]);
    selection = new SelectionModel<Aetitle>(true, []);
    aetitles: Aetitle[];
    clinicas: UserClinica[];
    pacsList: Pacs[];
    displayedColumns: string[] = [
        'aetitle',
        'tipo_aetitle',
        'pacs_identificacao',
        'clinica_relacionada',
        'status',
        'ultima_sincronizacao_pacs',
        'action'
    ];

    constructor(
        public themeService: CustomizerSettingsService,
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
        private aetitleService: AetitleService,
        private clinicaService: ClinicaService,
        private pacsService: PacsService,
        private userService: UserService,
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.searchForm = this.formBuilder.group({
            aetitle: [''],
            tipo: [''],
            pacs_identificacao: ['']
        });
    }

    ngOnInit(): void {
        this.isAdmin = this.userService.verifyGroup(UserGroups.ADMIN);
        this.isLoading = true;
        forkJoin({
            result1: this.clinicaService.query(),
            result2: this.aetitleService.query(), // <-- sem paginação!
            result3: this.pacsService.query(),
        }).subscribe({
            next: ({result1, result2, result3}) => {
                this.clinicas = result1;
                this.aetitles = result2;
                this.pacsList = result3;


                this.runFrontendSearch(); // primeira busca já renderiza a tabela
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
            }
        });
    }

    private loadAetitles(page: number = 1, page_size: number = 20): void {
        this.isLoading = true;
        forkJoin({
            result1: this.clinicaService.query(),
            result2: this.aetitleService.queryPaginated(page, page_size),
            result3: this.pacsService.query(),
        }).subscribe({
            next: ({result1, result2, result3,}) => {
                this.clinicas = result1;
                let aetitlesPaginatedList = result2;
                this.pacsList = result3;
                aetitlesPaginatedList.items.forEach(aetitle => {
                    aetitle.status = PacsSyncStatusMapper.getDescription(aetitle.status_sincronizacao_pacs as PacsSyncStatus);
                    aetitle.tipo_aetitle = TipoAetitleMapper.getDescription(aetitle.tipo as TipoAetitle);
                    this.pacsList.forEach(pacs => {
                        if (aetitle.pacs_id == pacs.id) {
                            aetitle.pacs_identificacao = pacs.identificacao;
                            return;
                        }
                    });
                    this.clinicas.forEach(clinica => {
                        if (aetitle.clinica_id == clinica.id) {
                            aetitle.clinica_relacionada = clinica.nome;
                            return;
                        }
                    });
                });
                this.dataSource.data = aetitlesPaginatedList.items;
                this.currentLength = aetitlesPaginatedList.total;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Erro ao buscar os dados:', err);
                this.isLoading = false;
            }
        });
    }

    private runFrontendSearch(page: number = 1, pageSize: number = 20): void {
        this.isLoading = true;
        const filters = this.searchForm.value;
        const result = this.aetitleService.search(this.aetitles, page, pageSize, filters);
        this.dataSource.data = result.items.map(aetitle => {
            aetitle.status = PacsSyncStatusMapper.getDescription(aetitle.status_sincronizacao_pacs as PacsSyncStatus);
            aetitle.tipo_aetitle = TipoAetitleMapper.getDescription(aetitle.tipo as TipoAetitle);
            aetitle.pacs_identificacao = this.pacsList.find(p => p.id == aetitle.pacs_id)?.identificacao ?? '';
            aetitle.clinica_relacionada = this.clinicas.find(c => c.id == aetitle.clinica_id)?.nome ?? '';
            return aetitle;
        });
        this.currentLength = result.total;
        this.isLoading = false;
    }

//----------------------------------------------------------------------------------------------------------------------
    onCreate() {
        this.dialog.open(SelectCreateAetitleTypeComponent, {
            width: '400px',
        }).afterClosed().subscribe(result => {
            this.dialog.open(CreateAetitleComponent, {
                width: '900px',
                data: result as TipoAetitle
            });
        });
    }

    onEdit(aetitle: Aetitle) {
        this.dialog.open(EditAetitleComponent, {
            data: aetitle,
            width: '900px',
        }).afterClosed().subscribe(result => {
        });
    }

    onDelete(aetitle: Aetitle) {

    }


    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.dataSource.data);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Aetitle): string {
        // if (!row) {
        //     return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        // }
        // return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.NumberOfStudyRelatedInstances + 1}`;
        return '';
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    // onPageChange(event: PageEvent) {
    //     this.loadAetitles(event.pageIndex + 1, event.pageSize);
    // }

    onSearch() {
        this.runFrontendSearch();
    }

    onPageChange(event: PageEvent) {
        this.runFrontendSearch(event.pageIndex + 1, event.pageSize);
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }
}
