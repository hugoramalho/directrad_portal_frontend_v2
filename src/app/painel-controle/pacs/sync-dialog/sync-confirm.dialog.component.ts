/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 27/03/2025
 **/

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {MatButton} from "@angular/material/button";
import {Pacs} from "../../../@shared/model/pacs/pacs";

@Component({
    standalone: true,
    selector: 'app-sync-pacs-confirm-dialog',
    templateUrl: './sync-confirm.dialog.component.html',
    imports: [
        MatButton
    ]
})
export class SyncPacsConfirmDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<SyncPacsConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public pacs: Pacs
    ) {}

    selectOption(option: boolean) {
        this.dialogRef.close(option);
    }
}
