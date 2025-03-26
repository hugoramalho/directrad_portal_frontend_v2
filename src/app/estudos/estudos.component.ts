import {NgIf} from '@angular/common';
import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {RouterLink} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {CustomizerSettingsService} from '../customizer-settings/customizer-settings.service';
import {EstudoService} from '../@shared/service/estudo/study.service';
import {Estudo} from '../@shared/model/estudo/exame';
import {MenuEstudosDialogComponent} from './menu/options-menu.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {DateFormatPipe} from '../@shared/pipe/date.pipe';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DcmQueryParams} from "../@shared/dcm/query-params";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {dateValidator} from "../@shared/date.validator";
import {EditarEstudoDialogComponent} from "./edicao/edicao-estudo.component";
import {PaginatedListInterface} from "../@shared/model/http/paginated-list-interface";
import {PaginatedList} from "../@shared/model/http/paginated-list";
import {tap} from "rxjs/operators";
import {PacsService} from "../@shared/service/pacs/pacs.service";
import {Pacs} from "../@shared/model/pacs/pacs";
import {UserService} from "../@shared/service/usuario/user.service";
import {UserGroups} from "../@shared/model/usuario/user-groups";
import {MatTab} from "@angular/material/tabs";
import {STUDIES_OPTION_MENU} from "./menu/options-menu.enum";
import {DatetimeFormatPipe} from "../@shared/pipe/datetime.pipe";
import {EstudoViewerService} from "../@shared/service/estudo/study-viewer.service";
import {MatIcon} from "@angular/material/icon";


@Component({
    selector: 'app-to-do-list',
    standalone: true,
    imports: [
        // MenuContextoEstudosComponent,
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        RouterLink,
        MatTableModule,
        NgIf,
        MatCheckboxModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        CommonModule,
        DateFormatPipe,
        MatDialogModule,
        ReactiveFormsModule,
        MatProgressSpinner,
        FormsModule,
        MatPaginatorModule,
        MatTab,
        DatetimeFormatPipe,
        MatIcon
    ],
    templateUrl: './estudos.component.html',
    styleUrl: './estudos.component.scss'
})
export class EstudosComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    isToggled: boolean = false;
    isLoading: boolean = true;
    currentLength: number = 0;
    selectedDateRange: string = 'last7Days';
    dataSource = new MatTableDataSource<Estudo>([]);
    selection = new SelectionModel<Estudo>(true, []);
    searchForm: FormGroup;
    classApplied = false;
    pacsMap = new Map<string | number, Pacs>();
    pacsList: Pacs[] = [];
    filteredPacsList: Pacs[] = [];
    selectedPacs: Pacs | undefined;
    isAdmin: boolean = false;
    displayedColumns: string[] = [
        'select',
        'paciente',
        'dataNascimento',
        'dataExame',
        'modalidade',
        'study',
        'action'
    ];
    dateRangeOptions = [
        {value: 'since-start', label: 'Qualquer período'},
        {value: 'today', label: 'Hoje'},
        {value: 'yesterday', label: 'Ontem'},
        {value: 'last7Days', label: 'Últimos 7 dias'},
        {value: 'last30Days', label: 'Últimos 30 dias'},
        {value: 'specificDate', label: 'Data específica'},
        {value: 'range', label: 'Intervalo'},
    ];
    studyModalities = [
        {value: "US", name: "Ultrassom (US)"},
        {value: "CT", name: "Tomografia Computadorizada (CT)"},
        {value: "MR", name: "Ressonância magnética (MR)"},
        {value: "DR, DX", name: "Raio X (DR|DX)"},
        {value: "MG", name: "Mamografia (MG)"},
        {value: "PT", name: "PET Scan (PT)"},
        {value: "NM", name: "Medicina nuclear (MN)"},
        {value: "XA", name: "Angiografia (XA)"},
        {value: "RF", name: "Fluoroscopia (RF)"},
        {value: "BMD", name: "Densitometria óssea (BMD)"},
        {value: "NM", name: "Cintilografia (NM)"},
    ];

    constructor(
        public themeService: CustomizerSettingsService,
        private estudoService: EstudoService,
        // private menuContexto: MenuContextoEstudosComponent,
        private dialog: MatDialog,
        private formBuilder: FormBuilder,
        private pacsService: PacsService,
        private userService: UserService,
        private estudoViewerService: EstudoViewerService
    ) {
    }

    ngOnInit(): void
    {
        this.isAdmin = this.userService.verifyGroup(UserGroups.ADMIN);
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.pacsService.query().subscribe((pacsArray: Pacs[]) => {
            this.pacsList = pacsArray;
            this.filteredPacsList = pacsArray;
            this.pacsMap = new Map(pacsArray.map(pacs => [pacs.id, pacs]));
            let pacsId = this.userService.getUser()?.pacs_id;
            if(pacsId) {
                this.selectedPacs = this.pacsMap.get(pacsId);
            }
        });
        // Definir "Últimos 7 dias" como opção inicial
        this.selectedDateRange = 'last7Days';

        // Data de hoje e de 7 dias atrás
        const today = new Date();
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 7);

        // Formatar para "YYYYMMDD-YYYYMMDD"
        const studyDateRange = `${this.formatDateToYmd(last7Days)}-${this.formatDateToYmd(today)}`;

        // Inicializar o formulário com os filtros corretos
        this.searchForm = this.formBuilder.group({
            study_date: [studyDateRange], // Define a data inicial no formato correto
            study_uid: [''],
            modalities_in_study: [''],
            patient_name: [''],
            patient_id: [''],
            patient_birth_date: [null],
            dateOption: [this.selectedDateRange], // Define a opção inicial como 'last7Days'
            specificDate: [null],
            rangeStart: [last7Days], // Preenche os campos auxiliares para UI
            rangeEnd: [today],
            pacs_id: [this.userService.getUser()?.pacs_id]
        });
        // Carregar exames automaticamente com este filtro inicial
        this.loadExames(1, this.paginator?.pageSize || 20);
    }

    onPacsSearch(value: string) {
        this.filteredPacsList = this.pacsList.filter(pacs =>
            pacs.identificacao?.toLowerCase().includes(value.toLowerCase())
        );
    }

    formatDateInput(event: Event): void
    {
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

    validateAndSetDate(event: Event): void
    {
        const input = event.target as HTMLInputElement;
        const value = input.value;

        // Verifica se o valor é uma data válida no formato DD/MM/YYYY
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!regex.test(value)) {
            this.searchForm.get('patient_birth_date')?.setErrors({invalidDate: true});
            return;
        }

        const [month, day, year] = value.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        // const date = new Date(year, day, month - 1);

        // Verifica se a data é válida (instância de Date válida)
        if (
            date.getFullYear() !== year ||
            date.getMonth() + 1 !== month ||
            date.getDate() !== day
        ) {
            this.searchForm.get('patient_birth_date')?.setErrors({invalidDate: true});
            return;
        }

        // Atualiza o FormControl com um objeto Date válido
        this.searchForm.patchValue({
            patient_birth_date: date,
        });
        this.searchForm.get('patient_birth_date')?.setErrors(null);
    }

    getSelectedValues(): string {
        const selected = this.searchForm.get('modalities_in_study')?.value;
        return selected ? selected.join(', ') : 'Modalidades';
    }

    onOptionChange(): void {
        const dateOption = this.searchForm.value.dateOption;
        if (dateOption !== 'specificDate' && dateOption !== 'range') {
            this.searchForm.patchValue({
                specificDate: null,
                rangeStart: null,
                rangeEnd: null,
            });
        }
    }

    formatDateToYmd(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

    private loadExames(page: number = 1, page_size: number = 20): void {
        const filters = this.getSearchFilters();
        this.estudoService.getEstudos(page, page_size, filters).subscribe({
            next: (examesList: PaginatedList<Estudo[]>) => {
                this.dataSource.data = examesList.items; // Atualiza a tabela com os dados recebidos
                this.currentLength = examesList.total;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Erro ao carregar os exames:', error);
                this.isLoading = false;
            }
        });
    }

    private getSearchFilters(): Record<string, any>
    {
        const filters = {...this.searchForm.value};
        const today = new Date();

        switch (filters.dateOption) {
            case 'since-start':
                filters.study_date = null;
                break;
            case 'today':
                filters.study_date = this.formatDateToYmd(today);
                break;
            case 'yesterday':
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                filters.study_date = this.formatDateToYmd(yesterday);
                break;
            case 'last7Days':
                const last7Days = new Date(today);
                last7Days.setDate(today.getDate() - 7);
                filters.study_date = this.formatDateToYmd(last7Days);
                break;
            case 'last30Days':
                const last30Days = new Date(today);
                last30Days.setDate(today.getDate() - 30);
                filters.study_date = this.formatDateToYmd(last30Days);
                break;
            case 'specificDate':
                filters.study_date = filters.specificDate
                    ? this.formatDateToYmd(filters.specificDate)
                    : null;
                break;
            case 'range':
                const start = filters.rangeStart
                    ? this.formatDateToYmd(filters.rangeStart)
                    : null;
                const end = filters.rangeEnd
                    ? this.formatDateToYmd(filters.rangeEnd)
                    : null;
                filters.study_date = start && end ? `${start}-${end}` : null;
                break;
        }

        if (filters.patient_birth_date) {
            filters.patient_birth_date = this.formatDateToYmd(filters.patient_birth_date);
        }

        // Removendo campos auxiliares desnecessários antes de enviar os filtros
        delete filters.specificDate;
        delete filters.rangeStart;
        delete filters.rangeEnd;
        delete filters.dateOption;

        return filters;
    }


    public onSearch(): void
    {
        this.isLoading = true;
        const filters = {...this.searchForm.value};
        const today = new Date();
        // Converte a data para o formato desejado
        switch (filters.dateOption) {
            case 'since-start':
                filters.study_date = null;
                break;
            case 'today':
                filters.study_date = this.formatDateToYmd(today);
                break;
            case 'yesterday':
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                filters.study_date = this.formatDateToYmd(yesterday);
                break;
            case 'last7Days':
                const last7Days = new Date(today);
                last7Days.setDate(today.getDate() - 7);
                filters.study_date = this.formatDateToYmd(last7Days);
                break;
            case 'last30Days':
                const last30Days = new Date(today);
                last30Days.setDate(today.getDate() - 30);
                filters.study_date = this.formatDateToYmd(last30Days);
                break;
            case 'specificDate':
                filters.study_date = filters.specificDate
                    ? this.formatDateToYmd(filters.specificDate)
                    : null;
                break;
            case 'range':
                const start = filters.rangeStart
                    ? this.formatDateToYmd(filters.rangeStart)
                    : null;
                const end = filters.rangeEnd
                    ? this.formatDateToYmd(filters.rangeEnd)
                    : null;
                filters.study_date = start && end ? `${start}-${end}` : null;
                break;
        }

        if (filters.patient_birth_date) {
            filters.patient_birth_date = this.formatDateToYmd(filters.patient_birth_date);
        }
        // Remove campos auxiliares para enviar apenas o necessário
        delete filters.specificDate;
        delete filters.rangeStart;
        delete filters.rangeEnd;
        delete filters.dateOption;
        this.estudoService.getEstudos(1, 10, filters).subscribe({
            next: (examesList: PaginatedList<Estudo[]>) => {
                this.dataSource.data = examesList.items;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Erro ao carregar os exames:', error);
            }
        });
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected()
    {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows()
    {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.dataSource.data);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Estudo): string {
        // if (!row) {
        //     return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        // }
        // return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.numImagens + 1}`;
        return '';
    }

    // Search Filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onPageChange(event: PageEvent) {
        this.loadExames(event.pageIndex + 1, event.pageSize); // pageIndex começa em 0, então somamos 1
    }

    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    criarAcessoRis(uid: string) {

    }

    visualizarWeb(estudo: Estudo)
    {
        this.estudoViewerService.openViewer(estudo);
    }

    downloadEstudo(uid: string) {

    }

    menuEstudos(estudo: Estudo)
    {
        this.dialog.open(MenuEstudosDialogComponent, {
            maxHeight: '70vh'
        }).afterClosed().subscribe(result => {
            if (result) {
                if (result == STUDIES_OPTION_MENU.TAGS_DICOM) {
                    this.dialog.open(EditarEstudoDialogComponent, {
                        data: estudo,
                        maxHeight: '70vh'
                    })
                }
            }
        });
    }


    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}

