/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 19/03/2025
 **/

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {MatButton} from "@angular/material/button";
import {PacsHostType} from "../../../@shared/model/pacs/pacs-host-type";

@Component({
    standalone: true,
    selector: 'app-select-pacs-type',
    templateUrl: './pacs-type-choice.dialog.component.html',
    imports: [
        MatButton
    ]
})
export class SelectPacsTypeComponent {
    protected readonly PacsHostType = PacsHostType;

    constructor(
        public dialogRef: MatDialogRef<SelectPacsTypeComponent>
    ) {}

    selectOption(option: PacsHostType) {
        this.dialogRef.close(option); // Fecha o modal e retorna a escolha
    }
}
