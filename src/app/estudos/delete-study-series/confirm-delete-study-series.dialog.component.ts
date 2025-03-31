/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 31/03/2025
 **/

import {Component, Inject} from '@angular/core';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle
} from '@angular/material/dialog';
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
    MatTable
} from "@angular/material/table";
import {NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatTooltip} from "@angular/material/tooltip";
import {CustomizerSettingsService} from "../../customizer-settings/customizer-settings.service";

import {StudyDownload, StudyDownloadSerie} from "../../@shared/model/estudo/study-download";
import {unknownValuePipe} from "../../@shared/pipe/unknown-value";


@Component({
    standalone: true,
    selector: 'app-delete-study-series-confirm-modal',
    templateUrl: './confirm-delete-series.dialog.component.html',
    styleUrls: ['./confirm-delete-study-series.dialog.component.scss'],
    imports: [
        MatTable,
        MatDialogContent,
        MatHeaderCell,
        MatColumnDef,
        MatCell,
        MatCellDef,
        MatHeaderCellDef,
        NgIf,
        MatIconButton,
        MatIcon,
        FormsModule,
        MatHeaderRow,
        MatRow,
        MatHeaderRowDef,
        MatRowDef,
        MatDialogActions,
        MatButton,
        MatProgressSpinner,
        MatTooltip,
        MatDialogTitle,
        ReactiveFormsModule,
        unknownValuePipe
    ]
})
export class ConfirmDeleteStudiesSeriesDialogComponent {
    isToggled = false;
    displayedColumns: string[] = [
        'series_name',
        'modality',
        'study_date',
        'total_images',
        'actions',
    ];

    constructor(
        @Inject(MAT_DIALOG_DATA) public selectedSerie: StudyDownloadSerie,
        public dialogRef: MatDialogRef<ConfirmDeleteStudiesSeriesDialogComponent>,
        public themeService: CustomizerSettingsService,
    ) {
    }

    ngOnInit(): void {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }

    onConfirm() {
        this.dialogRef.close(true);
    }

}
