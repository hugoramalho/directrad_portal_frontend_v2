import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {NgIf} from "@angular/common";
import {UserService} from "../@shared/service/usuario/user.service";
import {UserGroups} from "../@shared/model/usuario/user-groups";
import {AccountSettingsComponent} from "./dados-cadastro/account-settings.component";
import {User} from "../@shared/model/usuario/user";
import {UserPreferencesComponent} from "./preferencias/user-preferences.component";

@Component({
    selector: 'app-usuario',
    standalone: true,
    imports: [
        RouterLink,
        MatTab,
        MatTabGroup,
        NgIf,
        AccountSettingsComponent,
        UserPreferencesComponent
    ],
    templateUrl: './usuario.component.html',
    styleUrl: './usuario.component.scss'
})
export class UsuarioComponent
{
    protected readonly UserGroups = UserGroups;
    user: User | null = null;

    constructor(
        private userService: UserService,
    ) {
    }

    ngOnInit() {
        this.user = this.userService.getUser();
    }

    verifyUserGroup(group: UserGroups) {
        return this.userService.verifyGroup(group)
    }

}
