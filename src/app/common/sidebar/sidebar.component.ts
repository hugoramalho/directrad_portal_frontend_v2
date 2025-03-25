import {Component} from '@angular/core';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {RouterLink, RouterLinkActive, RouterModule} from '@angular/router';
import {ToggleService} from './toggle.service';
import {NgClass, NgIf} from '@angular/common';
import {CustomizerSettingsService} from '../../customizer-settings/customizer-settings.service';
import {UserService} from "../../@shared/service/usuario/user.service";
import {UserGroups} from "../../@shared/model/usuario/user-groups";
import {Pacs} from "../../@shared/model/pacs/pacs";
import {AuthService} from "../../@shared/service/auth/auth.service";
import {MatTab} from "@angular/material/tabs";

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        NgIf,
        NgScrollbarModule,
        MatExpansionModule,
        RouterLinkActive,
        RouterModule,
        RouterLink,
        NgClass,
        MatTab
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    isAdmin: boolean = false;
    // isSidebarToggled
    isSidebarToggled = false;

    // isToggled
    isToggled = false;
    logoUrl = '';
    logoUrlOpened = 'assets/images/logos/direct-rad-logo1.png';
    logoUrlClosed = 'assets/images/logos/image.png';


    constructor(
        private toggleService: ToggleService,
        public themeService: CustomizerSettingsService,
        private userService: UserService,
        private authService: AuthService,
    ) {
        this.toggleService.isSidebarToggled$.subscribe(isSidebarToggled => {
            this.isSidebarToggled = isSidebarToggled;
        });
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.isAdmin = this.userService.verifyGroup(UserGroups.ADMIN);
        this.logoUrl = this.isToggled ? this.logoUrlClosed : this.logoUrlOpened;
    }

    ngOnInit(): void
    {
        this.isAdmin = this.userService.verifyGroup(UserGroups.ADMIN);
    }

    // Burger Menu Toggle
    toggle() {
        this.isToggled = !this.isToggled;
        this.logoUrl = this.isToggled ? this.logoUrlClosed : this.logoUrlOpened;
        this.toggleService.toggle();
    }

    // Mat Expansion
    panelOpenState = false;

    // Dark Mode
    toggleTheme() {
        this.themeService.toggleTheme();
    }

    // Sidebar Dark
    toggleSidebarTheme() {
        this.themeService.toggleSidebarTheme();
    }

    // Right Sidebar
    toggleRightSidebarTheme() {
        this.themeService.toggleRightSidebarTheme();
    }

    // Hide Sidebar
    toggleHideSidebarTheme() {
        this.themeService.toggleHideSidebarTheme();
    }

    // Header Dark Mode
    toggleHeaderTheme() {
        this.themeService.toggleHeaderTheme();
    }

    // Card Border
    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    logout()
    {
        this.authService.logout();
    }

}
