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

@Component({
    standalone: true,
    selector: 'app-edit-estudo-modal',
    templateUrl: './edicao-estudo.component.html',
    styleUrls: ['./edicao-estudo.component.scss'],
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
export class EditarEstudoDialogComponent
{
    estudoForm: FormGroup;
    isToggled = false;
    estudoTags: EstudoTag[] = [];
    isModified: boolean = false;
    isLoading = true;
    displayedColumns: string[] = [
        'tag',
        'name',
        'value',
        'actions'
    ];
    dicomTagMap: Record<string, string> = {
        PregnancyStatus: '001021C0',
        SmokingStatus: '001021A0',
        StudyInstanceUID: "0020000D",
        StudyDate: "00080020",
        StudyTime: "00080030",
        StudyModality: "00080061",
        AccessionNumber: "00080050",
        StudyID: "00200010",
        ReferringPhysicianName: "00080090",
        StudyDescription: "00081030",
        NumberOfStudyRelatedInstances: "00201208",
        StudyPriorityID: "0032000C",
        ReasonForStudy: "00321030",
        RequestingService: "00321033",
        StudyComments: "00324000",
        AdmissionID: "00380010",
        RequestedProcedureID: "00401001",
        ProcedureCode: "00081032",
        RequestingPhysicianPhone: "00080094",
        PatientTransportArrangements: "00401004",
        SpecificCharacterSet: "00080005",
        RetrieveAETitle: "00080054",
        InstanceAvailability: "00080056",
        RetrieveUrl: "00081190",
        PatientNameIdeographic: "00100010_Ideographic",
        PatientNamePhonetic: "00100010_Phonetic",
        NumberOfStudyRelatedSeries: "00201206",
        ImagesInAcquisition: "00201002",
        SOPClassesInStudy: "00080062",
        IssuerOfPatientId: "00100021",
        OtherPatientNames: "00101001",
        PatientComments: "00104000",
        ModifiedAttributesSequence: "04000550",
        AttributeModificationDateTime: "04000562",
        ModifyingSystem: "04000563",
        SourceOfPreviousValues: "04000564",
        ReasonForTheAttributeModification: "04000565",
        PatientID: "00100020",
        PatientName: "00100010",
        PatientBirthDate: "00100030",
        PatientSex: "00100040",
        PatientSize: "00101020",
        PatientWeight: "00101030",
        PatientTelephoneNumbers: "00102154",
        PatientEmail: "00100032",
        PatientInsurancePlan: "00101081",
        EthnicGroup: "00102160",
        Occupation: "00102180",
        MedicalAlerts: "00102000",
        Allergies: "00102110",
        AdditionalPatientHistory: "001021B0",
        NumberOfPatientRelatedStudies: "00201200",
    };
    dicomEditableTagMap: Record<string, string> = {
        PregnancyStatus: '001021C0',
        SmokingStatus: '001021A0',
        AccessionNumber: "00080050",
        StudyDate: "00080020",
        StudyModality: "00080061",
        StudyDescription: "00081030",
        StudyPriorityID: "0032000C",
        ReasonForStudy: "00321030",
        RequestingService: "00321033",
        StudyComments: "00324000",
        AdmissionID: "00380010",
        RequestedProcedureID: "00401001",
        ProcedureCode: "00081032",
        RequestingPhysicianPhone: "00080094",
        PatientTransportArrangements: "00401004",
        PatientNameIdeographic: "00100010_Ideographic",
        PatientNamePhonetic: "00100010_Phonetic",
        OtherPatientNames: "00101001",
        PatientComments: "00104000",
        ReasonForTheAttributeModification: "04000565",
        PatientName: "00100010",
        PatientBirthDate: "00100030",
        PatientSex: "00100040",
        PatientSize: "00101020",
        PatientWeight: "00101030",
        PatientTelephoneNumbers: "00102154",
        PatientEmail: "00100032",
        PatientInsurancePlan: "00101081",
        EthnicGroup: "00102160",
        Occupation: "00102180",
        MedicalAlerts: "00102000",
        Allergies: "00102110",
        AdditionalPatientHistory: "001021B0",
    };
    tagsInputTypeMap: Record<string, { component: string; options?: any }> = {
        PregnancyStatus: {
            component: 'app-bool-select',
            options: {
            }
        },
        SmokingStatus: {
            component: 'app-bool-select',
            options: {}
        },
        StudyDate: {
            component: 'app-data-input',
            options: {}
        },
        StudyModality: {
            component: 'app-study-modality-select',
            options: {
                multiple: false
            }
        },
        PatientBirthDate: {
            component: 'app-data-input',
            options: {}
        },
        PatientSex: {
            component: 'app-gender-select',
            options: {}
        },
        PatientSize: {
            component: 'app-unity-measure-input',
            options: {
                unitOptions: [{ value: 'cm', label: 'Centímetros' }]
            }
        },
        PatientWeight: {
            component: 'app-unity-measure-input',
            options: {
                unitOptions: [{ value: 'Kg', label: 'Kilogramas' }]
            }
        },
        PatientTelephoneNumbers: {
            component: 'app-phone-input'
        },
        PatientEmail: {
            component: 'input',
            options: {
                type: 'email'
            }
        }
    };


    constructor(
        @Inject(MAT_DIALOG_DATA) public estudo: Estudo,
        public dialogRef: MatDialogRef<EditarEstudoDialogComponent>,
        public themeService: CustomizerSettingsService,
        private estudoService: EstudoService,
        private formBuilder: FormBuilder,
    ) {
    }

    ngOnInit(): void
    {
        this.isLoading = true;
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.estudoForm = this.formBuilder.group({
            StudyDate: [null],
            StudyModality: [''],
            StudyDescription: [''],
            StudyPriorityID: [''],
            ReasonForStudy: [''],
            RequestingService: [''],
            StudyComments: [''],
            AdmissionID: [''],
            RequestedProcedureID: [''],
            ProcedureCode: [''],
            PregnancyStatus: [null],
            SmokingStatus: [null],
            RequestingPhysicianPhone: [''],
            PatientTransportArrangements: [''],
            PatientNameIdeographic: [''],
            PatientNamePhonetic: [''],
            OtherPatientNames: [''],
            PatientComments: [''],
            ReasonForTheAttributeModification: [''],
            PatientName: [''],
            PatientBirthDate: [null],
            PatientSex: [''],
            PatientSize: [''],
            PatientWeight: [''],
            PatientTelephoneNumbers: [''],
            PatientEmail: [''],
            PatientInsurancePlan: [''],
            EthnicGroup: [''],
            Occupation: [''],
            MedicalAlerts: [''],
            Allergies: [''],
            AdditionalPatientHistory: [''],
        });
        this.estudoTags = Object.keys(this.estudo)
            .filter((key) => this.dicomTagMap.hasOwnProperty(key))
            .map((key) => {
                const typedKey = key as keyof Estudo;
                const editable = this.dicomEditableTagMap.hasOwnProperty(key);
                return <EstudoTag> {
                    tag: this.dicomTagMap[key] || 'N/A',
                    name: key,
                    value: this.estudo[typedKey] || '',
                    isEditable: editable,
                    isEditing: false,
                };
            });
        this.isLoading = false;
    }

    getComponentForTag(tagName: string): { component: string; options?: any } | null
    {
        return this.tagsInputTypeMap[tagName] || null;
    }

    private loadEstudo(): void
    {
        this.estudoService.getEstudo(this.estudo.StudyInstanceUID).subscribe({
            next: (estudos) => {
                const estudo: Estudo = estudos[0];

                this.estudo = estudo;
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
            },
        });
    }

    enableEditing(tag: any): void
    {
        tag.isEditing = true;
        this.isModified = true;
    }

    disableEditing(tag: any): void
    {
        tag.isEditing = false;
    }

    onCancel(): void
    {
        this.dialogRef.close(); // Fecha o modal sem salvar alterações
    }

    onSave(): void
    {
        const updatedTags = this.estudoTags
            .filter((tag) => tag.isEditable)
            .map(({name, value}) => ({name, value}));
        console.log(updatedTags);
        // this.dialogRef.close(updatedTags);
    }
}
