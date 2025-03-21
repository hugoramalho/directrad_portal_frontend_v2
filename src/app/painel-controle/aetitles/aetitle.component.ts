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
import {PacsHostMapper, PacsHostType} from "../../@shared/model/pacs/pacs-host-type";
import {ClinicaService} from "../../@shared/service/usuario/clinica.service";
import {PacsService} from "../../@shared/service/pacs/pacs.service";
import {UserClinica} from "../../@shared/model/usuario/user-clinica";
import {Pacs} from "../../@shared/model/pacs/pacs";
import {PaginatedList} from "../../@shared/model/http/paginated-list";


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
        MatCheckboxModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginator
    ],
    templateUrl: './aetitle.component.html',
    styleUrl: './aetitle.component.scss'
})
export class CadastroAetitleComponent {
    isLoading: boolean = false;
    classApplied = false;
    isToggled = false;
    currentLength: number = 0;
    dataSource = new MatTableDataSource<Aetitle>([]);
    selection = new SelectionModel<Aetitle>(true, []);
    aetitles: Aetitle[];
    clinicas: UserClinica[];
    pacsList: Pacs[];

    displayedColumns: string[] = [
        'select',
        'aetitle',
        'tipo',
        'pacs_relacionado',
        'clinica_identificacao',
        'status_sincronizacao_pacs',
        'action'
    ];

    constructor(
        public themeService: CustomizerSettingsService,
        private dialog: MatDialog,
        private aetitleService: AetitleService,
        private clinicaService: ClinicaService,
        private pacsService: PacsService,
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.loadAetitles(1, 20);
    }


    private loadAetitles(page: number = 1, page_size: number = 20): void
    {
        forkJoin({
            result1: this.clinicaService.query(),
            result2: this.aetitleService.queryAll(page, page_size),
            result3: this.pacsService.queryAll(),
        }).subscribe({
            next: ({result1, result2, result3,}) => {
                console.log(result1, result2, result3);

                this.clinicas = result1;
                let aetitlesPaginatedList = result2;
                this.pacsList = result3;
                this.pacsList.forEach(pacs => {
                    aetitlesPaginatedList.items.forEach(aetitle => {
                        if (aetitle.pacs_id == pacs.id) {
                            aetitle.pacs_relacionado = pacs.identificacao;
                            return;
                        }
                    });
                });
                this.clinicas.forEach(clinica => {
                    aetitlesPaginatedList.items.forEach(aetitle => {
                        if (aetitle.clinica_id == clinica.id) {
                            aetitle.clinica_identificacao = clinica.nome_razao;
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

    onPageChange(event: PageEvent) {
        this.loadAetitles(event.pageIndex + 1, event.pageSize);
    }

    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    openAddAetitleModal() {
        const dialogRef = this.dialog.open(CreateAetitleComponent, {
            width: 'auto', // Define o tamanho do modal
            data: {}, // Dados iniciais se necessário
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // O resultado do modal será retornado aqui
                console.log('Modal result:', result);
                this.handleAetitleResult(result);
            }
        });
    }

    handleAetitleResult(result: any) {
        console.log('Aetitle salvo:', result);
    }

}
