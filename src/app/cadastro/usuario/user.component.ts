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
        MatIcon
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
    displayedColumns: string[] = [
        'select',
        'company',
        'username',
        'pacs_relacionado',
        'clinica_relacionada',
        'tele_relacionada',
        'action'
    ];

    constructor(
        public themeService: CustomizerSettingsService,
        private dialog: MatDialog,
        private usersService: UsersService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.loadUsers(1, 20);
    }

    private loadUsers(page: number = 1, page_size: number = 20): void {
        this.usersService.queryPaginated(page, page_size).subscribe({
            next: (result) => {
                this.users = result.items;
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
