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
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {SelectPacsTypeComponent} from "./cadastro-dialog/pacs-type-choice.dialog.component";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from '@angular/common';
import {EditPacsDialogComponent} from "./edit-dialog/edit-pacs.dialog.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {CreatePacsDialogComponent} from "./cadastro-dialog/create-pacs.dialog.component";
import {PacsCredentialsDialogComponent} from "./credentials-dialog/pacs-credentials.dialog.component";
import {EmptyValuePipe} from "../../@shared/pipe/empty-value.pipe";

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
        MatProgressSpinner,
        FormsModule,
        ReactiveFormsModule,
        EmptyValuePipe
    ],
    templateUrl: './pacs.component.html',
    styleUrl: './pacs.component.scss'
})
export class CadastroPacsComponent {
    protected readonly PacsHostType = PacsHostType;
    isLoading = true;
    classApplied = false;
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
            admin_user: [''],
            aetitle_storage_principal: [''],
            ip: ['']
        });
    }

    ngOnInit(): void {
        this.isLoading = true;
        forkJoin({
            result1: this.clinicaService.query(),
            result2: this.teleUserService.query(),
            result3: this.aetitleService.query(),
            result4: this.usersService.queryAdminsPaginated(),
            result5: this.pacsService.query(),
        }).subscribe({
            next: ({result1, result2, result3, result4, result5}) => {
                this.clinicas = result1;
                this.teles = result2;
                this.aetitles = result3;
                this.adminUsers = result4;
                this.pacsList = result5;
                this.runFrontendSearch();
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Erro ao buscar os dados:', err);
                this.isLoading = false;
            }
        });
    }

    runFrontendSearch(page: number = 1, pageSize: number = 20): void {
        const filters = this.getSearchFilters();
        const result = this.pacsService.search(this.pacsList, page, pageSize, filters);
        this.dataSource.data = result.items.map(pacs => {
            pacs.host = PacsHostMapper.getDescription(pacs.tipo_pacs_application as PacsHostType);
            pacs.username_tele = this.teles.find(t => t.id === pacs.tele_id)?.full_name ?? '';
            pacs.username_admin = this.adminUsers.find(u => u.id === pacs.admin_id)?.username ?? '';
            pacs.main_storage_aetitle = this.aetitles.find(a => a.id === pacs.aet_principal)?.aetitle ?? '';
            return pacs;
        });
        this.currentLength = result.total;
    }

    private loadPacs(page: number = 1, page_size: number = 20): void {
        const filters = this.getSearchFilters();
        this.pacsService.queryPaginated(page, page_size, filters).subscribe({
            next: (pacsList: PaginatedList<Pacs[]>) => {
                pacsList.items.forEach(pacs => {
                    if (pacs.tipo_pacs !== PacsHostType.PACS_CLIENTE) {
                        return;
                    }
                    pacs.host = PacsHostMapper.getDescription(pacs.tipo_pacs_application as PacsHostType);
                    this.teles.forEach(tele => {
                        if (pacs.tele_id == tele.id) {
                            pacs.username_tele = tele.full_name;
                            return;
                        }
                    });
                    this.aetitles.forEach(aetitle => {
                        if (pacs.aet_principal == aetitle.id) {
                            pacs.main_storage_aetitle = aetitle.aetitle;
                            return;
                        }
                    });
                    this.adminUsers.forEach(user => {
                        if (pacs.admin_id == user.id) {
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
                this.isLoading = false;
            }
        });
    }


//----------------------------------------------------------------------------------------------------------------------
    onSearch() {
        this.runFrontendSearch(); // busca a partir da página 1
    }

    onPageChange(event: PageEvent) {
        this.runFrontendSearch(event.pageIndex + 1, event.pageSize);
    }

    onAccess(pacs: Pacs) {
    }

    onInstall(pacs: Pacs) {
    }

    onSyncPacs(pacs: Pacs) {
        this.dialog.open(PacsCredentialsDialogComponent, {
            width: '500px',
            data: pacs
        }).afterClosed().subscribe((result) => {
            // this.loadPacs();
        });
    }

    onCredentials(pacs: Pacs) {
        this.dialog.open(PacsCredentialsDialogComponent, {
            width: '500px',
            data: pacs
        }).afterClosed().subscribe((result) => {
            // this.ngOnInit();
        });
    }

    onCreate() {
        this.dialog.open(SelectPacsTypeComponent, {
            width: '400px',
        }).afterClosed().subscribe(result => {
            this.dialog.open(CreatePacsDialogComponent, {
                width: '900px',
                data: result as PacsHostType
            }).afterClosed().subscribe(result => {
                // this.ngOnInit();
            });
        });
    }

    onEdit(pacs: Pacs): void {
        const dialogRef = this.dialog.open(EditPacsDialogComponent, {
            width: '900px',
            data: pacs
        });
        dialogRef.afterClosed().subscribe((result) => {
            // this.loadPacs();
        });
    }

    onDelete(pacs: Pacs) {
    }

    private getSearchFilters(): Record<string, any> {
        return {...this.searchForm.value};
    }

    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
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
    checkboxLabel(row?: Pacs): string {
        // if (!row) {
        //     return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        // }
        // return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.numImagens + 1}`;
        return '';
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }
}

