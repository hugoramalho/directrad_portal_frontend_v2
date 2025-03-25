/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 24/03/2025
 **/


import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogContent} from '@angular/material/dialog';
import {MatButton} from "@angular/material/button";
import {TipoAetitle} from "../../../@shared/model/pacs/aetitle-type";
import {NgIf} from "@angular/common";

@Component({
    standalone: true,
    selector: 'app-select-create-aetitle-type',
    templateUrl: './aetitle-choice.dialog.component.html',
    imports: [
        MatButton,
        MatDialogContent,
        NgIf
    ]
})
export class SelectCreateAetitleTypeComponent {
    protected readonly TipoAetitle = TipoAetitle;

    constructor(
        public dialogRef: MatDialogRef<SelectCreateAetitleTypeComponent>
    ) {}

    selectOption(option: TipoAetitle) {
        this.dialogRef.close(option); // Fecha o modal e retorna a escolha
    }
}
