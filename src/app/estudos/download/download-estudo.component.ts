import {Component, Inject} from '@angular/core';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle
} from '@angular/material/dialog';
import {EstudoService} from "../../@shared/service/estudo/study.service";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
    MatTable, MatTableDataSource
} from "@angular/material/table";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TagDicom} from "../../@shared/model/estudo/tag-dicom";
import {Estudo} from "../../@shared/model/estudo/exame";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatTooltip} from "@angular/material/tooltip";
import {CustomizerSettingsService} from "../../customizer-settings/customizer-settings.service";
import {DataInputComponent} from "../../@shared/component/date-input/date-input.component";
import {GenderSelectComponent} from "../../@shared/component/gender-select/gender-select.component";
import {TrueFalseSelectComponent} from "../../@shared/component/bool-select/bool-select.component";
import {
    StudyModalitySelectComponent
} from "../../@shared/component/study-modality-select/study-modality-select.component";
import {UnityMeasureInputComponent} from "../../@shared/component/unity-measure-input/unity-measure-input.component";
import {PhoneInputComponent} from "../../@shared/component/phone-number-input/phone-number-input.component";
import {Pacs} from "../../@shared/model/pacs/pacs";
import {EstudoTag} from "./estudo-tag";
import {EstudoDownloadService} from "../../@shared/service/estudo/study-download.service";
import {Aetitle} from "../../@shared/model/pacs/aetitle";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {StudyDownload, StudyDownloadSerie} from "../../@shared/model/estudo/study-download";
import {unknownValuePipe} from "../../@shared/pipe/unknown-value";

export interface DialogData {
    pacs: Pacs;
    aetitle: Aetitle;
    estudo: Estudo;
}

@Component({
    standalone: true,
    selector: 'app-edit-download-estudo-modal',
    templateUrl: './download-estudo.component.html',
    styleUrls: ['./download-estudo.component.scss'],
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
        MatInput,
        FormsModule,
        MatHeaderRow,
        MatRow,
        MatHeaderRowDef,
        MatRowDef,
        MatDialogActions,
        MatButton,
        MatProgressSpinner,
        MatTooltip,
        DataInputComponent,
        GenderSelectComponent,
        TrueFalseSelectComponent,
        StudyModalitySelectComponent,
        UnityMeasureInputComponent,
        PhoneInputComponent,
        NgSwitchCase,
        NgSwitch,
        MatDialogTitle,
        MatFormField,
        MatLabel,
        MatOption,
        MatSelect,
        NgForOf,
        ReactiveFormsModule,
        unknownValuePipe
    ]
})
export class DownloadEstudoDialogComponent {
    estudoForm: FormGroup;
    isToggled = false;
    estudoDonwloadSeriesInfo: StudyDownloadSerie[] = [];
    estudoDonwload: StudyDownload;
    isModified: boolean = false;
    isLoading = true;
    selectedAetitle: Aetitle;
    selectedPacs: Pacs;
    estudo: Estudo;
    dataSource = new MatTableDataSource<StudyDownloadSerie>([]);
    displayedColumns: string[] = [
        'series_name',
        'modality',
        'study_date',
        'total_images',
        'actions',
    ];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        public dialogRef: MatDialogRef<DownloadEstudoDialogComponent>,
        public themeService: CustomizerSettingsService,
        private estudoService: EstudoService,
        private estudoDownloadService: EstudoDownloadService,
        private formBuilder: FormBuilder,
    ) {
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.selectedAetitle = this.data.aetitle;
        this.selectedPacs = this.data.pacs;
        this.estudo = this.data.estudo;
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.estudoForm = this.formBuilder.group({
            uncompressed: [false],
        });
        this.estudoDownloadService.getDownloadInfo(
            this.selectedPacs,
            this.selectedAetitle,
            this.estudo
        ).subscribe(estudoDownloadInfo => {
            console.log(estudoDownloadInfo.series);

            this.estudoDonwload = estudoDownloadInfo;
            this.dataSource.data = this.estudoDonwload.series
            this.dataSource.connect();
            this.isLoading = false;

        });
    }

    onCancel(): void {
        this.dialogRef.close(); // Fecha o modal sem salvar alterações
    }

    onDonwload(study: StudyDownload): void {
        return this.estudoDownloadService.onDonwload(
            this.selectedPacs,
            this.selectedAetitle,
            study,
            this.estudoForm.value
        );
    }

    onDownloadSerie(serie: StudyDownloadSerie) {
        return this.estudoDownloadService.onDownloadSerie(this.selectedPacs, this.selectedAetitle, serie);
    }

}
