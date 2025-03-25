import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButton, MatIconButton} from "@angular/material/button";
import {EstudoService} from "../../@shared/service/estudo/study.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {STUDIES_OPTION_MENU} from "./options-menu.enum";

@Component({
    selector: 'app-menu-estudos',
    standalone: true,
    imports: [
        MatMenuModule,
        MatIconModule,
        MatDialogModule,
        MatButton,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './options-menu.component.html',
    styleUrl: './options-menu.component.scss'
})
export class MenuEstudosDialogComponent
{
    protected readonly STUDIES_OPTION_MENU = STUDIES_OPTION_MENU;

    constructor(
        public dialogRef: MatDialogRef<MenuEstudosDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { uid: string }
    ) {
    }

    onClose(): void
    {
        this.dialogRef.close();
    }

    selectOption(option: STUDIES_OPTION_MENU)
    {
        this.dialogRef.close(option); // Fecha o modal e retorna a escolha
    }
}
