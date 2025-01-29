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
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';


@Component({
    selector: 'app-cadastro-ssh',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, RouterLink, MatTableModule, NgIf, MatCheckboxModule, MatTooltipModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
    templateUrl: './ssh.component.html',
    styleUrl: './ssh.component.scss'
})
export class CadastroAcessoSshComponent {

    displayedColumns: string[] = ['select', 'paciente', 'dataNascimento', 'dataExame', 'modalidade', 'study', 'uid', 'status', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    selection = new SelectionModel<PeriodicElement>(true, []);

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
    checkboxLabel(row?: PeriodicElement): string {
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

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        numImagens: '#951',
        taskName: 'Hotel management system',
        paciente: 'Shawn Kennedy',
        dataNascimento: '12 Nov, 2024',
        dataExame: '15 Nov, 2024',
        modalidade: 'CT',
        study: 'Abdome',
        uid: '1.2.392.200036.9107.500.111234524111113002',
        status: {
            inProgress: 'In Progress',
            // pending: 'Pending',
            // completed: 'Completed',
            // notStarted: 'Not Started',
        },
       action: {
            download: 'download',
            access: 'key',
            view: 'visibility',
            edit: 'more_vert',
            delete: 'delete'
        }
    },
    {
        numImagens: '#587',
        taskName: 'Send proposal to APR Ltd',
        paciente: 'Roberto Cruz',
        dataNascimento: '12 Nov, 2024',
        dataExame: '14 Nov, 2024',
        modalidade: 'CT',
        study: 'Abdome',
        uid: '1.2.392.200036.9107.500.111234524111113002',
        status: {
            // inProgress: 'In Progress',
            pending: 'Pending',
            // completed: 'Completed',
            // notStarted: 'Not Started',
        },
       action: {
            download: 'download',
            access: 'key',
            view: 'visibility',
            edit: 'more_vert',
            delete: 'delete'
        }
    },
    {
        numImagens: '#618',
        taskName: 'Python upgrade',
        paciente: 'Juli Johnson',
        dataNascimento: '12 Nov, 2024',
        dataExame: '13 Nov, 2024',
        modalidade: 'CT',
        study: 'Abdome',
        uid: '1.2.392.200036.9107.500.111234524111113002',
        status: {
            // inProgress: 'In Progress',
            // pending: 'Pending',
            completed: 'Completed',
            // notStarted: 'Not Started',
        },
       action: {
            download: 'download',
            access: 'key',
            view: 'visibility',
            edit: 'more_vert',
            delete: 'delete'
        }
    },
    {
        numImagens: '#367',
        taskName: 'Schedule meeting with Daxa',
        paciente: 'Catalina Engles',
        dataExame: '12 Nov, 2024',
        dataNascimento: '12 Nov, 2024',
        modalidade: 'CT',
        study: 'Abdome',
        uid: '1.2.392.200036.9107.500.111234524111113002',
        status: {
            // inProgress: 'In Progress',
            // pending: 'Pending',
            // completed: 'Completed',
            notStarted: 'Not Started',
        },
       action: {
            download: 'download',
            access: 'key',
            view: 'visibility',
            edit: 'more_vert',
            delete: 'delete'
        }
    },
    {
        numImagens: '#761',
        taskName: 'Engineering lite touch',
        paciente: 'Louis Nagle',
        dataNascimento: '12 Nov, 2024',
        dataExame: '11 Nov, 2024',
        modalidade: 'CT',
        study: 'Abdome',
        uid: '1.2.392.200036.9107.500.111234524111113002',
        status: {
            inProgress: 'In Progress',
            // pending: 'Pending',
            // completed: 'Completed',
            // notStarted: 'Not Started',
        },
       action: {
            download: 'download',
            access: 'key',
            view: 'visibility',
            edit: 'more_vert',
            delete: 'delete'
        }
    },
    {
        numImagens: '#431',
        taskName: 'Refund bill payment',
        paciente: 'Michael Marquez',
        dataNascimento: '12 Nov, 2024',
        dataExame: '10 Nov, 2024',
        modalidade: 'CT',
        study: 'Abdome',
        uid: '1.2.392.200036.9107.500.111234524111113002',
        status: {
            // inProgress: 'In Progress',
            // pending: 'Pending',
            // completed: 'Completed',
            notStarted: 'Not Started',
        },
       action: {
            download: 'download',
            access: 'key',
            view: 'visibility',
            edit: 'more_vert',
            delete: 'delete'
        }
    },
    {
        numImagens: '#421',
        taskName: 'Public beta release',
        paciente: 'James Andy',
        dataNascimento: '12 Nov, 2024',
        dataExame: '09 Nov, 2024',
        modalidade: 'CT',
        study: 'Abdome',
        uid: '1.2.392.200036.9107.500.111234524111113002',
        status: {
            inProgress: 'In Progress',
            // pending: 'Pending',
            // completed: 'Completed',
            // notStarted: 'Not Started',
        },
       action: {
            download: 'download',
            access: 'key',
            view: 'visibility',
            edit: 'more_vert',
            delete: 'delete'
        }
    },
    {
        numImagens: '#624',
        taskName: 'Fix platform errors',
        paciente: 'Alina Smith',
        dataNascimento: '12 Nov, 2024',
        dataExame: '08 Nov, 2024',
        modalidade: 'CT',
        study: 'Abdome',
        uid: '1.2.392.200036.9107.500.111234524111113002',
        status: {
            // inProgress: 'In Progress',
            // pending: 'Pending',
            completed: 'Completed',
            // notStarted: 'Not Started',
        },
       action: {
            download: 'download',
            access: 'key',
            view: 'visibility',
            edit: 'more_vert',
            delete: 'delete'
        }
    },
    {
        numImagens: '#513',
        taskName: 'Launch our mobile app',
        paciente: 'David Warner',
        dataNascimento: '12 Nov, 2024',
        dataExame: '07 Nov, 2024',
        modalidade: 'CT',
        study: 'Abdome',
        uid: '1.2.392.200036.9107.500.111234524111113002',
        status: {
            // inProgress: 'In Progress',
            pending: 'Pending',
            // completed: 'Completed',
            // notStarted: 'Not Started',
        },
       action: {
            download: 'download',
            access: 'key',
            view: 'visibility',
            edit: 'more_vert',
            delete: 'delete'
        }
    }
];

export interface PeriodicElement {
    taskName: string;
    numImagens: string;
    paciente: string;
    dataNascimento: string;
    dataExame: string;
    modalidade: string;
    study: string;
    uid: string;
    status: any;
    action: any;
}
