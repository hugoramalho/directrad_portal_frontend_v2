import {Component, Inject} from '@angular/core';
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
import {CadastroPacsComponent} from "./pacs/pacs.component";
import {CadastroRotinaComponent} from "./rotinas/rotina.component";
import {CadastroAcessoSshComponent} from "./ssh/ssh.component";
import {CadastroAetitleComponent} from "./aetitles/aetitle.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder} from "@angular/forms";
import {ClinicaService} from "../@shared/service/usuario/clinica.service";
import {AetitleService} from "../@shared/service/pacs/aetitle.service";
import {PacsService} from "../@shared/service/pacs/pacs.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../@shared/service/usuario/user.service";
import {PacsNetworkService} from "../@shared/service/pacs/network.service";
import {forkJoin} from "rxjs";
import {UserGroups} from "../@shared/model/usuario/user-groups";

@Component({
    selector: 'app-painel-controle',
    standalone: true,
    imports: [
        RouterLink,
        MatCardModule,
        MatTabsModule,
        DatePipe,
        MatFormFieldModule,
        SshTerminalComponent,
        NgIf,
        CadastroPacsComponent,
        CadastroRotinaComponent,
        CadastroAcessoSshComponent,
        CadastroAetitleComponent
    ],
    templateUrl: './pacs-controle.component.html',
    styleUrl: './pacs-controle.component.scss'
})
export class PacsControleComponent {
    isAdmin: boolean = false;

    constructor(
        private userService: UserService,
    ) {
    }

    ngOnInit()
    {
        this.isAdmin = this.userService.verifyGroup(UserGroups.ADMIN);
    }

}
