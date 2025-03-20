/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 19/03/2025
 **/

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {MatButton} from "@angular/material/button";

@Component({
    standalone: true,
    selector: 'app-select-pacs-type',
    templateUrl: './cadastro_choice.dialog.component.html',
    imports: [
        MatButton
    ]
})
export class SelectPacsTypeComponent {
    constructor(
        public dialogRef: MatDialogRef<SelectPacsTypeComponent>
    ) {}

    selectOption(option: 'host-central' | 'host-proprio') {
        this.dialogRef.close(option); // Fecha o modal e retorna a escolha
    }
}
