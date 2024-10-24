import {Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {CustomizerSettingsService} from '../../../customizer-settings/customizer-settings.service';
import {Account} from "./account";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        RouterLink,
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        RouterLinkActive,
        MatSelectModule,
        MatIconModule,
        CommonModule,
        FormsModule,
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    accounts: Account[] = [
        { name: 'Nubank Conta Corrente', value: 'nubank-cc' },
        { name: 'C6 Bank Conta de Pagamento', value: 'c6-cp' }
    ];

    currentDate = new Date();

    navigateDate(direction: number): void {
        this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() + direction));
    }

    get currentMonth(): Date {
        return this.currentDate;
    }

    // Dark Mode
    toggleTheme() {
        this.themeService.toggleTheme();
    }

    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}
