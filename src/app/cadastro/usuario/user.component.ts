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
import {ClinicaService} from "../../@shared/service/usuario/clinica.service";
import {PacsService} from "../../@shared/service/pacs/pacs.service";
import {UserClinica} from "../../@shared/model/usuario/user-clinica";
import {Pacs} from "../../@shared/model/pacs/pacs";
import {UserTele} from "../../@shared/model/usuario/user-tele";
import {MatChip, MatChipSet} from "@angular/material/chips";
import {EmptyValuePipe} from "../../@shared/pipe/empty-value.pipe";
import {EditUserDialogComponent} from "./edit-dialog/edit-user.dialog.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";


@Component({
    standalone: true,
    selector: 'app-cadastro-usuario',
    imports: [
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
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
        EmptyValuePipe,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss'
})
export class CadastroUsuarioComponent {
    protected readonly PacsHostType = PacsHostType;
    isLoading: boolean = false;
    searchForm: FormGroup;
    classApplied = false;
    isToggled = false;
    currentLength: number = 0;
    dataSource = new MatTableDataSource<User>([]);
    selection = new SelectionModel<User>(true, []);
    users: User[];
    clinicas: UserClinica[];
    teleUsers: UserTele[];
    filteredTeles: UserTele[];
    pacsList: Pacs[];
    filteredPacs: Pacs[];
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
        private formBuilder: FormBuilder,
        private usersService: UsersService,
        private userService: UserService,
        private aetitleService: AetitleService,
        private clinicaService: ClinicaService,
        private pacsService: PacsService

    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.searchForm = this.formBuilder.group({
            username: [''],
            pacs_id: [''],
            clinica: [''],
            tele_id: [''],
        });
    }

    ngOnInit(): void {
        this.isAdmin = this.userService.verifyGroup(UserGroups.ADMIN);
        this.isLoading = true;
        forkJoin({
            result1: this.clinicaService.query(),
            result2: this.usersService.queryTeles(),
            result3: this.pacsService.query(),
            result4: this.aetitleService.query(),
            result5: this.usersService.query()
        }).subscribe({
            next: ({result1, result2, result3, result4, result5}) => {
                this.clinicas = result1;
                this.teleUsers = result2;
                this.filteredTeles = result2;
                this.pacsList = result3;
                this.filteredPacs = result3;
                this.aetitles = result4;
                this.users = result5;
                // this.loadUsers(1, 20);
                this.runFrontendSearch(); // primeira busca já renderiza a tabela

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

    private runFrontendSearch(page: number = 1, pageSize: number = 20): void {
        this.isLoading = true;
        const filters = this.searchForm.value;
        const result = this.usersService.search(this.users, page, pageSize, filters);
        this.dataSource.data = result.items.map(user => {
            user?.groups?.map(group => {
                group.group_name = UserGroupsMapper.getDescription(group.group_id);
            })
            user.tele = this.teleUsers.find(u => u.id == user.tele_id)?.username
            user.clinica = this.clinicas.find(c => c.id == user.clinica_id)?.nome;
            user.pacs = this.pacsList.find(p => p.id == user.pacs_id)?.identificacao;
            return user;
        });
        this.currentLength = result.total;
        this.isLoading = false;
    }

//----------------------------------------------------------------------------------------------------------------------
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
        this.runFrontendSearch(event.pageIndex + 1, event.pageSize);
    }
    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }
    onCreate() {
        this.dialog.open(CreateUserDialogComponent, {
            width: 'auto', // Define o tamanho do modal
            data: {}, // Dados iniciais se necessário
        }).afterClosed()
            .subscribe((result) => {

            });
    }
    onEdit(user: User) {
        this.dialog.open(EditUserDialogComponent, {
            width: 'auto', // Define o tamanho do modal
            data: user, // Dados iniciais se necessário
        }).afterClosed()
            .subscribe((result) => {

            });
    }

    onSearch(){
        this.runFrontendSearch();
    }

    onPacsSearch(value: string)
    {
        this.filteredPacs = this.pacsList.filter(pacs =>
            pacs.identificacao?.toLowerCase().includes(value.toLowerCase())
        );
    }

    onTeleSearch(value: string) {
        this.filteredTeles = this.teleUsers.filter(user =>
            user.full_name?.toLowerCase().includes(value.toLowerCase())
        );
    }

}
