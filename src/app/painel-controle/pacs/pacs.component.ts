import {Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
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
import {CustomizerSettingsService} from '../../customizer-settings/customizer-settings.service';
import {PacsService} from "../../@shared/service/pacs/pacs.service";
import {PaginatedList} from "../../@shared/model/http/paginated-list";
import {ClinicaService} from "../../@shared/service/usuario/clinica.service";
import {TeleUserService} from "../../@shared/service/usuario/tele.service";
import {UserClinica} from "../../@shared/model/usuario/user-clinica";
import {UserTele} from "../../@shared/model/usuario/user-tele";
import {forkJoin} from "rxjs";
import {Pacs} from "../../@shared/model/pacs/pacs";
import {PacsHostMapper, PacsHostType} from "../../@shared/model/pacs/pacs-host-type";
import {AetitleService} from "../../@shared/service/pacs/aetitle.service";
import {Aetitle} from "../../@shared/model/pacs/aetitle";
import {UsersService} from "../../@shared/service/usuario/users.service";
import {UserAdmin} from "../../@shared/model/usuario/user-admin";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {SelectPacsTypeComponent} from "./cadastro-dialog/pacs-type-choice.dialog.component";
import {MatIcon} from "@angular/material/icon";
import { NgIf } from '@angular/common';
import {EditPacsDialogComponent} from "./edit-dialog/edit-pacs.dialog.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {CreatePacsDialogComponent} from "./cadastro-dialog/create-pacs.dialog.component";
import {PacsCredentialsDialogComponent} from "./credentials-dialog/pacs-credentials.dialog.component";

@Component({
    selector: 'app-cadastro-pacs',
    standalone: true,
    imports: [
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        MatTableModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginator,
        MatIcon,
        NgIf,
        MatProgressSpinner
    ],
    templateUrl: './pacs.component.html',
    styleUrl: './pacs.component.scss'
})
export class CadastroPacsComponent {
    protected readonly PacsHostType = PacsHostType;
    isLoading = true;
    searchForm: FormGroup;
    dataSource = new MatTableDataSource<Pacs>([]);
    selection = new SelectionModel<Pacs>(true, []);
    currentLength: number = 0;
    isToggled = false;
    clinicas: UserClinica[];
    teles: UserTele[];
    adminUsers: UserAdmin[];
    pacsList: Pacs[] = [];
    aetitles: Aetitle[];
    displayedColumns: string[] = [
        'identificacao',
        'ip',
        'main_storage_aetitle',
        'username_admin',
        'username_tele',
        'host',
        'action'
    ];

    constructor(
        public themeService: CustomizerSettingsService,
        private pacsService: PacsService,
        private clinicaService: ClinicaService,
        private teleUserService: TeleUserService,
        private aetitleService: AetitleService,
        private usersService: UsersService,
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.searchForm = this.formBuilder.group({
            identificacao: [''],
            username_admin: [''],
            main_storage_aetitle: [''],
            ip: ['']
        });
    }

    ngOnInit(): void
    {
        this.isLoading = true;
        forkJoin({
            result1: this.clinicaService.query(),
            result2: this.teleUserService.query(),
            result3: this.aetitleService.query(),
            result4: this.usersService.queryAdmin(),
        }).subscribe({
            next: ({ result1, result2, result3, result4 }) => {
                this.clinicas = result1;
                this.teles = result2;
                this.aetitles = result3;
                this.adminUsers = result4;
                this.loadPacs();
            },
            error: (err) => {
                console.error('Erro ao buscar os dados:', err);
                this.isLoading = false;
            }
        });
    }

    onPageChange(event: PageEvent)
    {
        this.loadPacs(event.pageIndex + 1, event.pageSize);
    }

    private loadPacs(page: number = 1, page_size: number = 20): void
    {
        const filters = this.getSearchFilters();
        this.pacsService.get(page, page_size, filters).subscribe({
            next: (pacsList: PaginatedList<Pacs[]>) => {
                pacsList.items.forEach(pacs => {
                    if(pacs.tipo_pacs !== PacsHostType.PACS_CLIENTE) {
                        return;
                    }
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
                    });
                    this.adminUsers.forEach(user => {
                        if(pacs.admin_id == user.id) {
                            pacs.username_admin = user.username;
                            return;
                        }
                    });
                    this.pacsList.push(pacs);
                })
                this.dataSource.data = this.pacsList;
                this.currentLength = pacsList.total;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Erro ao carregar os exames:', error);
                this.isLoading = false;
            }
        });
    }

    openCreatePacsModal()
    {
        const dialogRef = this.dialog.open(SelectPacsTypeComponent, {
            width: '400px',
        });
        // dialogRef.afterClosed().subscribe((result) => {
        //     if (result) {
        //         this.loadPacs(); // recarrega a lista se houve atualização
        //     }
        // });
        dialogRef.afterClosed().subscribe(result => {
            this.dialog.open(CreatePacsDialogComponent, {
                width: '900px',
                data: result as PacsHostType
            });
        });
    }

    private getSearchFilters(): Record<string, any>
    {
        return {...this.searchForm.value};
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
    checkboxLabel(row?: Pacs): string
    {
        // if (!row) {
        //     return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        // }
        // return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.numImagens + 1}`;
        return '';
    }

    // Search Filter
    applyFilter(event: Event)
    {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    // Popup Trigger
    classApplied = false;
    toggleClass()
    {
        this.classApplied = !this.classApplied;
    }

    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    onAccess(pacs: Pacs)
    {
    }

    onInstall(pacs: Pacs)
    {
    }

    onCredentials(pacs: Pacs)
    {
        this.dialog.open(PacsCredentialsDialogComponent, {
            width: '500px',
            data: pacs
        }).afterClosed().subscribe((result) => {
            if (result) {
                this.loadPacs();
            }
        });
    }

    onEdit(pacs: Pacs): void
    {
        const dialogRef = this.dialog.open(EditPacsDialogComponent, {
            width: '900px',
            data: pacs
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loadPacs(); // recarrega a lista se houve atualização
            }
        });
    }

    onDelete(pacs: Pacs)
    {
    }

}

