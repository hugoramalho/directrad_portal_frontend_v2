import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Lancamento } from '../../../@shared/model/financeiro/lancamento';
import { LancamentoRepository } from '../../../@shared/service/financeiro/lancamento.repository';
import {Conta} from "../../../@shared/model/financeiro/conta";
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
import {SidebarComponent} from "../../../apps/email/sidebar/sidebar.component";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {SelectionModel} from "@angular/cdk/collections";
import {CustomizerSettingsService} from "../../../customizer-settings/customizer-settings.service";
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgIf} from "@angular/common";
import {ContaFinanceiroDataSource} from "../../../@shared/service/financeiro/conta.datasource";

interface CardSettings {
    title: string;
    content: string|number;
}

@Component({
    selector: 'app-financeiro-conta',
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
        NgIf,
    ],
    standalone: true,
    styleUrls: ['./contas.component.scss'],
    templateUrl: './contas.component.html',
})
export class FinanceiroCadastroContaComponent implements OnInit{
    lancamentos: Lancamento[] = [];
    contas: Conta[] = [];
    contaAtiva: Conta|null = null;
    // solarValue: number;
    // saldoCard: CardSettings = {
    //   title: 'Saldo disponível',
    //   content: 1000.00,
    // };

    constructor(
        private lancamentoRepository: LancamentoRepository,
        public themeService: CustomizerSettingsService,
        private contasDatasource: ContaFinanceiroDataSource

    ) {
    }

    hasContas(): boolean{
        return this.contas?.length > 0;
    }

    ngOnInit(): void {
        // this.contasDatasource.getContas().subscribe(data => {
        //   if(data){
        //       this.contas = data
        //   }
        //     // this.contas = data.data || this.contas;
        // });
    }


}




