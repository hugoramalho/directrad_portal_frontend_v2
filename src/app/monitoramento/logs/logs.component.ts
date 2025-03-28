// import {Component} from '@angular/core';
// import {MatCardModule} from '@angular/material/card';
// import {MatButtonModule} from '@angular/material/button';
// import {MatMenuModule} from '@angular/material/menu';
// import {MatTableDataSource, MatTableModule} from '@angular/material/table';
// import {SelectionModel} from '@angular/cdk/collections';
// import {MatCheckboxModule} from '@angular/material/checkbox';
// import {MatTooltipModule} from '@angular/material/tooltip';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import {MatInputModule} from '@angular/material/input';
// import {MatSelectModule} from '@angular/material/select';
// import {MatDatepickerModule} from '@angular/material/datepicker';
// import {MatNativeDateModule} from '@angular/material/core';
// import {CustomizerSettingsService} from '../../customizer-settings/customizer-settings.service';
// import {forkJoin} from "rxjs";
// import {Pacs} from "../../@shared/model/pacs/pacs";
// import {PacsHostMapper, PacsHostType} from "../../@shared/model/pacs/pacs-host-type";
// import {UsersService} from "../../@shared/service/usuario/users.service";
// import {MatPaginator, PageEvent} from "@angular/material/paginator";
// import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
// import {MatDialog} from "@angular/material/dialog";
// import {MatIcon} from "@angular/material/icon";
// import {NgIf} from '@angular/common';
// import {MatProgressSpinner} from "@angular/material/progress-spinner";
// import {EmptyValuePipe} from "../../@shared/pipe/empty-value.pipe";
// import {LogsService} from "../../@shared/service/monitoramento/logs.service";
// import {Log} from "../../@shared/model/monitoramento/log";
//
// @Component({
//     selector: 'app-cadastro-pacs',
//     standalone: true,
//     imports: [
//         MatCardModule,
//         MatMenuModule,
//         MatButtonModule,
//         MatTableModule,
//         MatCheckboxModule,
//         MatTooltipModule,
//         MatFormFieldModule,
//         MatInputModule,
//         MatSelectModule,
//         MatDatepickerModule,
//         MatNativeDateModule,
//         MatPaginator,
//         MatIcon,
//         NgIf,
//         MatProgressSpinner,
//         FormsModule,
//         ReactiveFormsModule,
//         EmptyValuePipe
//     ],
//     templateUrl: './logs.component.html',
//     styleUrl: './logs.component.scss'
// })
// export class LogMonitoramentoComponent {
//     protected readonly PacsHostType = PacsHostType;
//     isLoading = true;
//     classApplied = false;
//     searchForm: FormGroup;
//     dataSource = new MatTableDataSource<Log>([]);
//     selection = new SelectionModel<Log>(true, []);
//     currentLength: number = 0;
//     isToggled = false;
//     logs: Log[] = [];
//     displayedColumns: string[] = [
//         'file_name',
//         'application',
//         'action'
//     ];
//
//     constructor(
//         public themeService: CustomizerSettingsService,
//         private logsService: LogsService,
//         private usersService: UsersService,
//         private formBuilder: FormBuilder,
//         private dialog: MatDialog,
//     ) {
//         this.themeService.isToggled$.subscribe(isToggled => {
//             this.isToggled = isToggled;
//         });
//         this.searchForm = this.formBuilder.group({
//             identificacao: [''],
//             admin_user: [''],
//             aetitle_storage_principal: [''],
//             ip: ['']
//         });
//     }
//
//     ngOnInit(): void {
//         this.isLoading = true;
//         forkJoin({
//             result1: this.usersService.queryAdminsPaginated(),
//             result2: this.usersService.queryAdminsPaginated(),
//         }).subscribe({
//             next: ({result1, result2}) => {
//                 // this.runFrontendSearch();
//                 this.isLoading = false;
//             },
//             error: (err) => {
//                 console.error('Erro ao buscar os dados:', err);
//                 this.isLoading = false;
//             }
//         });
//     }
//
//
//     private loadLogs(page: number = 1, page_size: number = 20): void {
//         // const filters = this.getSearchFilters();
//         this.logsService.get().subscribe({
//             next: (logs: Log[]) => {
//                 this.dataSource.data = logs;
//                 this.currentLength = logs.length;
//                 this.isLoading = false;
//             },
//             error: (error) => {
//                 this.isLoading = false;
//             }
//         });
//     }
//
//
// //----------------------------------------------------------------------------------------------------------------------
// //     onSearch() {
// //         this.runFrontendSearch(); // busca a partir da página 1
// //     }
// //
// //     onPageChange(event: PageEvent) {
// //         this.runFrontendSearch(event.pageIndex + 1, event.pageSize);
// //     }
//
//     onAccess(pacs: Pacs) {
//     }
//
//     onInstall(pacs: Pacs) {
//     }
//
//     onSyncPacs(pacs: Pacs) {
//         this.dialog.open(PacsCredentialsDialogComponent, {
//             width: '500px',
//             data: pacs
//         }).afterClosed().subscribe((result) => {
//             // this.loadPacs();
//         });
//     }
//
//     onCredentials(pacs: Pacs) {
//         this.dialog.open(PacsCredentialsDialogComponent, {
//             width: '500px',
//             data: pacs
//         }).afterClosed().subscribe((result) => {
//             // this.ngOnInit();
//         });
//     }
//
//     onCreate() {
//         this.dialog.open(SelectPacsTypeComponent, {
//             width: '400px',
//         }).afterClosed().subscribe(result => {
//             this.dialog.open(CreatePacsDialogComponent, {
//                 width: '900px',
//                 data: result as PacsHostType
//             }).afterClosed().subscribe(result => {
//                 // this.ngOnInit();
//             });
//         });
//     }
//
//     onEdit(pacs: Pacs): void {
//         const dialogRef = this.dialog.open(EditPacsDialogComponent, {
//             width: '900px',
//             data: pacs
//         });
//         dialogRef.afterClosed().subscribe((result) => {
//             // this.loadPacs();
//         });
//     }
//
//     onDelete(pacs: Pacs) {
//     }
//
//     private getSearchFilters(): Record<string, any> {
//         return {...this.searchForm.value};
//     }
//
//     toggleClass() {
//         this.classApplied = !this.classApplied;
//     }
//
//     toggleRTLEnabledTheme() {
//         this.themeService.toggleRTLEnabledTheme();
//     }
//
//     /** Selects all rows if they are not all selected; otherwise clear selection. */
//     toggleAllRows() {
//         if (this.isAllSelected()) {
//             this.selection.clear();
//             return;
//         }
//         this.selection.select(...this.dataSource.data);
//     }
//
//     /** The label for the checkbox on the passed row */
//     checkboxLabel(row?: Pacs): string {
//         // if (!row) {
//         //     return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
//         // }
//         // return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.numImagens + 1}`;
//         return '';
//     }
//
//     applyFilter(event: Event) {
//         const filterValue = (event.target as HTMLInputElement).value;
//         this.dataSource.filter = filterValue.trim().toLowerCase();
//     }
//
//     /** Whether the number of selected elements matches the total number of rows. */
//     isAllSelected() {
//         const numSelected = this.selection.selected.length;
//         const numRows = this.dataSource.data.length;
//         return numSelected === numRows;
//     }
// }
//
