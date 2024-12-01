import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomizerSettingsService } from '../customizer-settings/customizer-settings.service';
import { EstudoRepository } from './exame.service';
import { Exame } from './exame';

@Component({
    selector: 'app-to-do-list',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, RouterLink, MatTableModule, NgIf, MatCheckboxModule, MatTooltipModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
    templateUrl: './exame.component.html',
    styleUrl: './exame.component.scss'
})
export class ExamesComponent {

    displayedColumns: string[] = ['select', 'paciente', 'dataNascimento', 'dataExame', 'modalidade', 'study', 'uid', 'action'];
    dataSource = new MatTableDataSource<Exame>([]);
    selection = new SelectionModel<Exame>(true, []);

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
    checkboxLabel(row?: Exame): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.numImagens + 1}`;
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

    criarAcessoRis(uid: string) {

    }

    visualizarWeb(uid: string) {

    }

    menuContextoEstudos(uid: string) {

    }

    // isToggled
    isToggled = false;

    constructor(
      public themeService: CustomizerSettingsService,
      private estudoRepository: EstudoRepository // Injeção do serviço
  ) {
      this.themeService.isToggled$.subscribe(isToggled => {
          this.isToggled = isToggled;
      });
  }

  private loadExames(): void {
    this.estudoRepository.getEstudos().subscribe({
        next: (exames: Exame[]) => {
          console.log(exames);
            this.dataSource.data = exames; // Atualiza a tabela com os dados recebidos
        },
        error: (error) => {
            console.error('Erro ao carregar os exames:', error);
        }
    });
}

  ngOnInit(): void {
      this.loadExames(); // Carregar os dados ao inicializar
  }

    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}

