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
    MatTable
} from "@angular/material/table";
import {NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {FormBuilder, FormGroup, FormsModule} from "@angular/forms";
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

export interface DialogData {
    pacs: Pacs;
    aetitle: Aetitle;
    estudo: Estudo;
}

@Component({
    standalone: true,
    selector: 'app-edit-estudo-modal',
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
        MatDialogTitle
    ]
})
export class DownloadEstudoDialogComponent {
    estudoForm: FormGroup;
    isToggled = false;
    estudoTags: EstudoTag[] = [];
    isModified: boolean = false;
    isLoading = true;
    selectedAetitle: Aetitle;
    selectedPacs: Pacs;
    estudo: Estudo;
    displayedColumns: string[] = [
        'tag',
        'name',
        'value',
        'actions'
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
            StudyDate: [null],
            StudyModality: [''],

        });
        // this.estudoDownloadService.getDownloadInfo(this.selectedPacs, this.selectedAetitle, this.estudo).subscribe({
        //     next: data => {
        //     }
        // })
        this.isLoading = false;
    }

    onCancel(): void {
        this.dialogRef.close(); // Fecha o modal sem salvar alterações
    }

    onDonwload(): void {
        const updatedTags = this.estudoTags
            .filter((tag) => tag.isEditable)
            .map(({name, value}) => ({name, value}));
        console.log(updatedTags);
        // this.dialogRef.close(updatedTags);
    }

    onDonwloadMaxQuality(): void {
        const updatedTags = this.estudoTags
            .filter((tag) => tag.isEditable)
            .map(({name, value}) => ({name, value}));
        console.log(updatedTags);
        // this.dialogRef.close(updatedTags);
    }
}
