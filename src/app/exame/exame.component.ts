import {NgIf} from '@angular/common';
import {Component} from '@angular/core';
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
import {CustomizerSettingsService} from '../customizer-settings/customizer-settings.service';
import {EstudoRepository} from './exame.service';
import {Estudo} from './exame';
import {MenuEstudosComponent} from './menu/options-menu.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {DateFormatPipe} from '../@shared/pipe/date-pipe';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DcmQueryParams} from "../@shared/dcm/query-params";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {dateValidator} from "../@shared/date.validator";
import {EditarEstudoModalComponent} from "./edicao/edicao-estudo.component";


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
    ],
    templateUrl: './exame.component.html',
    styleUrl: './exame.component.scss'
})
export class ExamesComponent {

    displayedColumns: string[] = ['select', 'paciente', 'dataNascimento', 'dataExame', 'modalidade', 'study', 'action'];
    dataSource = new MatTableDataSource<Estudo>([]);
    selection = new SelectionModel<Estudo>(true, []);
    isToggled = false;
    isLoading = true;
    selectedDateRange: string = 'since-start';
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
        {value: "US", name: "Ultrassom (US)" },
        {value: "CT", name: "Tomografia Computadorizada (CT)" },
        {value: "MR", name: "Ressonância magnética (MR)" },
        {value: "DR, DX", name: "Raio X (DR|DX)" },
        {value: "MG", name: "Mamografia (MG)" },
        {value: "PT", name: "PET Scan (PT)" },
        {value: "NM", name: "Medicina nuclear (MN)" },
        {value: "XA", name: "Angiografia (XA)" },
        {value: "RF", name: "Fluoroscopia (RF)" },
        {value: "BMD", name: "Densitometria óssea (BMD)" },
        {value: "NM", name: "Cintilografia (NM)" },
    ];
    searchForm: FormGroup;
    classApplied = false;


    constructor(
        public themeService: CustomizerSettingsService,
        private estudoRepository: EstudoRepository,
        // private menuContexto: MenuContextoEstudosComponent,
        private dialog: MatDialog,
        private formBuilder: FormBuilder,
    ) {
    }

    ngOnInit(): void {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.searchForm = this.formBuilder.group({
            STUDY_DATE: [null], // Campo único que armazenará a data no formato Ymd ou o intervalo
            STUDY_INSTANCE_UID: [''],
            MODALITIES_IN_STUDY: [''],
            PATIENT_NAME: [''],
            PATIENT_ID: [''],
            PATIENT_BIRTH_DATE: [null],
            dateOption: ['any'], // Valor inicial do select
            specificDate: [null], // Campo auxiliar para "Data específica"
            rangeStart: [null],   // Campo auxiliar para início do intervalo
            rangeEnd: [null], // Campo auxiliar para fim do intervalo
        });
        this.loadExames();
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

        // Verifica se o valor é uma data válida no formato DD/MM/YYYY
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!regex.test(value)) {
            this.searchForm.get('PATIENT_BIRTH_DATE')?.setErrors({ invalidDate: true });
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
            this.searchForm.get('PATIENT_BIRTH_DATE')?.setErrors({ invalidDate: true });
            return;
        }

        // Atualiza o FormControl com um objeto Date válido
        this.searchForm.patchValue({
            PATIENT_BIRTH_DATE: date,
        });
        this.searchForm.get('PATIENT_BIRTH_DATE')?.setErrors(null);
    }


    getSelectedValues(): string {
        const selected = this.searchForm.get('MODALITIES_IN_STUDY')?.value;
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

    private loadExames(): void {
        this.estudoRepository.getEstudos().subscribe({
            next: (exames: Estudo[]) => {
                this.dataSource.data = exames; // Atualiza a tabela com os dados recebidos
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Erro ao carregar os exames:', error);
            }
        });
    }

    public onSearch(): void {
        this.isLoading = true;
        const filters = { ...this.searchForm.value };
        const today = new Date();
        // Converte a data para o formato desejado
        switch (filters.dateOption) {
            case 'since-start':
                filters.STUDY_DATE = null;
                break;
            case 'today':
                filters.STUDY_DATE = this.formatDateToYmd(today);
                break;
            case 'yesterday':
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                filters.STUDY_DATE = this.formatDateToYmd(yesterday);
                break;
            case 'last7Days':
                const last7Days = new Date(today);
                last7Days.setDate(today.getDate() - 7);
                filters.STUDY_DATE = this.formatDateToYmd(last7Days);
                break;
            case 'last30Days':
                const last30Days = new Date(today);
                last30Days.setDate(today.getDate() - 30);
                filters.STUDY_DATE = this.formatDateToYmd(last30Days);
                break;
            case 'specificDate':
                filters.STUDY_DATE = filters.specificDate
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
                filters.STUDY_DATE = start && end ? `${start}-${end}` : null;
                break;
        }

        if (filters.PATIENT_BIRTH_DATE) {
            filters.PATIENT_BIRTH_DATE = this.formatDateToYmd(filters.PATIENT_BIRTH_DATE);
        }
        // Remove campos auxiliares para enviar apenas o necessário
        delete filters.specificDate;
        delete filters.rangeStart;
        delete filters.rangeEnd;
        delete filters.dateOption;
        this.estudoRepository.getEstudos(1, 10, filters).subscribe({
            next: (exames: Estudo[]) => {
                this.dataSource.data = exames;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Erro ao carregar os exames:', error);
            }
        });
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


    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    criarAcessoRis(uid: string) {

    }

    visualizarWeb(uid: string) {

    }

    downloadEstudo(uid: string) {

    }

    menuEstudos(uid: string) {
        const dialogRef = this.dialog.open(EditarEstudoModalComponent, {
            data: {uid},
            maxHeight: '70vh'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(`Ação realizada: ${result.action}, UID: ${result.uid}`);
                // Execute ações específicas com base na resposta do diálogo
            }
        });
    }

    // isToggled


    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}

