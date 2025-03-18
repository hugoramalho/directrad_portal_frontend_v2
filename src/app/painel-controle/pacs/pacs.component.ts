import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import {PacsService} from "../../@shared/service/pacs/pacs.service";
import {PacsElement} from "../../@shared/model/pacs/pacs-element";
import {PaginatedList} from "../../@shared/model/http/paginated-list";
import {Estudo} from "../../@shared/model/estudo/exame";
import {ClinicaService} from "../../@shared/service/usuario/clinica.service";
import {TeleUserService} from "../../@shared/service/usuario/tele.service";
import {UserClinica} from "../../@shared/model/usuario/user-clinica";
import {UserTele} from "../../@shared/model/usuario/user-tele";
import {forkJoin} from "rxjs";
import {Pacs} from "../../@shared/model/pacs/pacs";
import {PacsHostMapper, PacsHostType} from "../../@shared/model/pacs/pacs-host-type";
import {AetitleService} from "../../@shared/service/pacs/aetitle.service";
import {Aetitle} from "../../@shared/model/pacs/aetitle";
import {User} from "../../@shared/model/usuario/user";
import {UsersService} from "../../@shared/service/usuario/users.service";
import {UserAdmin} from "../../@shared/model/usuario/user-admin";


@Component({
    selector: 'app-cadastro-pacs',
    standalone: true,
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
        MatNativeDateModule
    ],
    templateUrl: './pacs.component.html',
    styleUrl: './pacs.component.scss'
})
export class CadastroPacsComponent {
    displayedColumns: string[] = [
        'select',
        'identificacao',
        'ip',
        'main_storage_aetitle',
        'username_admin',
        'username_tele',
        'host',
        'action'
    ];
    dataSource = new MatTableDataSource<Pacs>([]);
    selection = new SelectionModel<Pacs>(true, []);
    isToggled = false;
    clinicas: UserClinica[];
    teles: UserTele[];
    adminUsers: UserAdmin[];
    pacsList: Pacs[];
    aetitles: Aetitle[];

    constructor(
        public themeService: CustomizerSettingsService,
        private pacsService: PacsService,
        private clinicaService: ClinicaService,
        private teleUserService: TeleUserService,
        private aetitleService: AetitleService,
        private usersService: UsersService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        forkJoin({
            result1: this.clinicaService.query(),
            result2: this.teleUserService.query(),
            result3: this.pacsService.get(),
            result4: this.aetitleService.query(),
            result5: this.usersService.query(),
        }).subscribe({
            next: ({ result1, result2, result3, result4, result5 }) => {
                this.clinicas = result1;
                this.teles = result2;
                this.pacsList = result3;
                this.aetitles = result4;
                this.adminUsers = result5;
                this.pacsList.forEach(pacs => {
                    pacs.host = PacsHostMapper.getDescription(pacs.tipo_pacs_application as PacsHostType);
                    this.teles.forEach(tele => {
                        if(pacs.tele_id == tele.id) {
                            pacs.username_tele = tele.full_name;
                            return;
                        }
                    });
                    this.aetitles.forEach(aetitle => {
                        if(pacs.aet_principal == aetitle.id) {
                            pacs.main_storage_aetitle = aetitle.aetitle;
                            return;
                        }
                    })
                    this.adminUsers.forEach(user => {
                        if(pacs.admin_id == user.id) {
                            pacs.username_admin = user.username;
                            return;
                        }
                    })
                    this.dataSource.data = this.pacsList;
                });


            },
            error: (err) => {
                console.error('Erro ao buscar os dados:', err);
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
    checkboxLabel(row?: PacsElement): string {
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

    // Popup Trigger
    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    private loadExames(page: number = 1, page_size: number = 20): void {
        // const filters = this.getSearchFilters();
        // this.pacsService.getEstudos(page, page_size, filters).subscribe({
        //     next: (examesList: PaginatedList<Estudo[]>) => {
        //         this.dataSource.data = examesList.items; // Atualiza a tabela com os dados recebidos
        //         this.currentLength = examesList.total;
        //         this.isLoading = false;
        //     },
        //     error: (error) => {
        //         console.error('Erro ao carregar os exames:', error);
        //         this.isLoading = false;
        //     }
        // });
    }

    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}

