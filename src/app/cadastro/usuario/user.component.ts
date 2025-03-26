/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 21/03/2025
 **/

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
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {UsersService} from "../../@shared/service/usuario/users.service";
import {User} from "../../@shared/model/usuario/user";
import {MatIcon} from "@angular/material/icon";
import {PacsHostType} from "../../@shared/model/pacs/pacs-host-type";
import {CreateUserDialogComponent} from "./create-dialog/create-user.dialog.component";
import {UserService} from "../../@shared/service/usuario/user.service";
import {UserGroups, UserGroupsMapper} from "../../@shared/model/usuario/user-groups";
import {AetitleService} from "../../@shared/service/pacs/aetitle.service";
import {forkJoin} from "rxjs";
import {PacsSyncStatus, PacsSyncStatusMapper} from "../../@shared/model/pacs/status-sync";
import {TipoAetitle, TipoAetitleMapper} from "../../@shared/model/pacs/aetitle-type";
import {ClinicaService} from "../../@shared/service/usuario/clinica.service";
import {PacsService} from "../../@shared/service/pacs/pacs.service";
import {UserClinica} from "../../@shared/model/usuario/user-clinica";
import {Pacs} from "../../@shared/model/pacs/pacs";
import {UserTele} from "../../@shared/model/usuario/user-tele";
import {MatChip, MatChipSet} from "@angular/material/chips";


@Component({
    standalone: true,
    selector: 'app-cadastro-usuario',
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
        MatPaginator,
        MatIcon,
        MatChipSet,
        MatChip
    ],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss'
})
export class CadastroUsuarioComponent {
    isLoading: boolean = false;
    classApplied = false;
    isToggled = false;
    currentLength: number = 0;
    dataSource = new MatTableDataSource<User>([]);
    selection = new SelectionModel<User>(true, []);
    users: User[];
    clinicas: UserClinica[];
    teleUsers: UserTele[];
    pacsList: Pacs[];
    aetitles: Aetitle[];
    isAdmin: boolean = false;
    displayedColumns: string[] = [
        'select',
        'company',
        'username',
        'user_groups',
        'pacs',
        'clinica',
        'tele',
        'action'
    ];

    constructor(
        public themeService: CustomizerSettingsService,
        private dialog: MatDialog,
        private usersService: UsersService,
        private userService: UserService,
        private aetitleService: AetitleService,
        private clinicaService: ClinicaService,
        private pacsService: PacsService

    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.isAdmin = this.userService.verifyGroup(UserGroups.ADMIN);
        this.isLoading = true;
        forkJoin({
            result1: this.clinicaService.query(),
            result2: this.usersService.queryTeles(),
            result3: this.pacsService.query(),
            result4: this.aetitleService.query()
        }).subscribe({
            next: ({result1, result2, result3, result4}) => {
                this.clinicas = result1;
                this.teleUsers = result2;
                this.pacsList = result3;
                this.aetitles = result4;
                this.loadUsers(1, 20);
            },
            error: (err) => {
                console.error('Erro ao buscar os dados:', err);
                this.isLoading = false;
            }
        });

    }

    private loadUsers(page: number = 1, page_size: number = 20): void {
        this.usersService.queryPaginated(page, page_size).subscribe({
            next: (result) => {
                result.items.forEach(user => {
                    user?.groups?.map(group => {
                        group.group_name = UserGroupsMapper.getDescription(group.group_id);
                    })
                    this.teleUsers.forEach(teleUser => {
                        if (teleUser.id == user.tele_id) {
                            user.tele = teleUser.username;
                            return;
                        }
                    });
                    this.clinicas.forEach(clinica => {
                        if (user.clinica_id === clinica.id) {
                            user.clinica = clinica.nome;
                            return;
                        }
                    });
                    this.pacsList.forEach(pacs => {
                        if (user.pacs_id === pacs.id) {
                            user.pacs = pacs.identificacao;
                            return;
                        }
                    });
                });
                this.dataSource.data = result.items;
                this.currentLength = result.total;
                this.isLoading = false;
            },
            error: (err) => {
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
    checkboxLabel(row?: User): string {
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
        this.loadUsers(event.pageIndex + 1, event.pageSize);
    }

    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    onCreateUser() {
        this.dialog.open(CreateUserDialogComponent, {
            width: 'auto', // Define o tamanho do modal
            data: {}, // Dados iniciais se necessário
        }).afterClosed()
            .subscribe((result) => {

            });
    }

    handleAetitleResult(result: any) {
        console.log('Aetitle salvo:', result);
    }

    protected readonly PacsHostType = PacsHostType;
}
