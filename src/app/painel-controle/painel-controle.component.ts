import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import {DatePipe, NgIf} from '@angular/common';
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
import { CustomizerSettingsService } from '../customizer-settings/customizer-settings.service';
import {SshTerminalComponent} from "./instalacao/instalacao.component";


@Component({
    selector: 'app-cadastro',
    standalone: true,
    imports: [
        RouterLink,
        MatCardModule,
        MatTabsModule,
        DatePipe,
        MatFormFieldModule,
        SshTerminalComponent,
        NgIf
    ],
    templateUrl: './painel-controle.component.html',
    styleUrl: './painel-controle.component.scss'
})
export class PainelControleComponent {
 // //
    // Tab group where the tab content is loaded lazily (when activated)
    // tabLoadTimes: Date[] = [];
    // getTimeLoaded(index: number) {
    //     if (!this.tabLoadTimes[index]) {
    //         this.tabLoadTimes[index] = new Date();
    //     }
    //     return this.tabLoadTimes[index];
    // }

    // Tab group with paginated tabs
    // lotsOfTabs = new Array(30).fill(0).map((_, index) => `Tab ${index}`);
    isTerminalActive = false;

    onTabChange(event: any): void {
        if (event.index === 4) { // Índice da aba "Terminal"
            this.isTerminalActive = true;
        }
    }
}
