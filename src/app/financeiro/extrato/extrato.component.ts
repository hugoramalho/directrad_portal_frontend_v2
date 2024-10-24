/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 25/03/2024
 **/

import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Lancamento} from '../../@shared/model/financeiro/lancamento';
import {Conta} from "../../@shared/model/financeiro/conta";
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {SelectionModel} from "@angular/cdk/collections";
import {CustomizerSettingsService} from "../../customizer-settings/customizer-settings.service";
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgIf} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {PaginatedList} from "../../@shared/model/paginated-list";
import {LancamentoFinanceiroDataSource} from "../../@shared/service/financeiro/lancamento.datasource";
import {ContaFinanceiroDataSource} from "../../@shared/service/financeiro/conta.datasource";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {Observable, of} from "rxjs";


@Component({
    selector: 'app-extrato',
    imports: [
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        RouterLink,
        MatTableModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        SidebarComponent,
        MatPaginatorModule,
        HttpClientModule,
        MatProgressSpinnerModule,
        NgIf
    ],
    standalone: true,
    styleUrls: ['./extrato.component.scss'],
    templateUrl: './extrato.component.html',
})
export class ExtratoComponent implements AfterViewInit, OnInit {
    carregado: boolean = false;
    contas: Conta[] | null = [];
    contaAtiva: Conta | null = null;
    isToggled = false;
    displayedColumns: string[] = ['select', 'date', 'title', 'description'];
    dataSource = new MatTableDataSource<Lancamento, MatPaginator>();
    selection = new SelectionModel<Lancamento>(true, []);
    lancamentos: Lancamento[] = [];
    pageIndex: number | undefined;
    pageSize: number | undefined;
    totalItens: number | undefined = 0;

    @ViewChild('paginator', {static: true}) paginator: MatPaginator;


    constructor(
        private lancamentoDatasource: LancamentoFinanceiroDataSource,
        private contaDatasource: ContaFinanceiroDataSource,
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    hasContas(): boolean {
        if (this.contas) {
            return this.contas.length > 0;
        }
        return false;
    }

    hasLancamentos(): boolean {
        // if (this.lancamentos) {
        //     return this.lancamentos.total > 0;
        // }
        return false;
    }

    ngOnInit() {

    }


    ngAfterViewInit() {

        console.log('ngAfterViewInit');

        this.contaDatasource.getContas().subscribe(data => {
            console.log('ngAfterViewInit contas', data);

            this.contas = data || this.contas;
            if (this.contas && this.contas?.length > 0) {
                this.contaAtiva = this.contas[0];
            }

            this.dataSource.paginator = this.paginator;
            this.paginator.page
                .pipe(
                    startWith({}),
                    switchMap(() => {
                        console.log('pipe');

                        return this.loadLancamentos(
                            this.contaAtiva,
                            this.paginator.pageIndex + 1,
                            this.paginator.pageSize
                        ).pipe(catchError(() => of(null)));
                    }),
                    map((empData) => {
                        if (empData == null) return [];
                        this.totalItens = empData.total;
                        return empData.items;
                    })
                )
                .subscribe((lancamentos) => {
                    console.log('lanc', lancamentos);
                    this.lancamentos = lancamentos || this.lancamentos;
                    this.dataSource = new MatTableDataSource(this.lancamentos);
                });

        });


    }


    loadLancamentos(conta: Conta |null, page: number, perPage: number) {
        return this.lancamentoDatasource.getLancamentosConta(conta, page, perPage, true);
    }

    // Whether the number of selected elements matches the total number of rows.
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    // Selects all rows if they are not all selected; otherwise clear selection.
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.dataSource.data);
    }

    // The label for the checkbox on the passed row
    checkboxLabel(row?: Lancamento): string | void {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        // return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.title + 1}`;
    }

    // Dark Mode
    toggleTheme() {
        this.themeService.toggleTheme();
    }

    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}
