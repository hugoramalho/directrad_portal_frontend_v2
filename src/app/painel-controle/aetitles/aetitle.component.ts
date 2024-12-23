// /**
//  * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
//  *
//  * Created at: 01/12/2024
//  **/
//
// import {Component, Inject} from '@angular/core';
// import {MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions} from '@angular/material/dialog';
// import {ApplicationEntityRepository} from "../application-entity.repository";
// import {
//     MatCell,
//     MatCellDef,
//     MatColumnDef,
//     MatHeaderCell,
//     MatHeaderCellDef,
//     MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
//     MatTable
// } from "@angular/material/table";
// import {NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
// import {MatButton, MatIconButton} from "@angular/material/button";
// import {MatIcon} from "@angular/material/icon";
// import {MatInput} from "@angular/material/input";
// import {FormBuilder, FormGroup, FormsModule} from "@angular/forms";
// import {ApplicationEntity} from "./application-entity";
// import {MatProgressSpinner} from "@angular/material/progress-spinner";
// import {MatTooltip} from "@angular/material/tooltip";
// import {CustomizerSettingsService} from "../../customizer-settings/customizer-settings.service";
// import {DataInputComponent} from "../../@shared/component/date-input/date-input.component";
// import {GenderSelectComponent} from "../../@shared/component/gender-select/gender-select.component";
// import {TrueFalseSelectComponent} from "../../@shared/component/bool-select/bool-select.component";
// import {
//     StudyModalitySelectComponent
// } from "../../@shared/component/study-modality-select/study-modality-select.component";
// import {UnityMeasureInputComponent} from "../../@shared/component/unity-measure-input/unity-measure-input.component";
// import {PhoneInputComponent} from "../../@shared/component/phone-number-input/phone-number-input.component";
//
// @Component({
//     standalone: true,
//     selector: 'app-edit-estudo-modal',
//     templateUrl: './edicao-estudo.component.html',
//     styleUrls: ['./edicao-estudo.component.scss'],
//     imports: [
//         MatTable,
//         MatDialogContent,
//         MatHeaderCell,
//         MatColumnDef,
//         MatCell,
//         MatCellDef,
//         MatHeaderCellDef,
//         NgIf,
//         MatIconButton,
//         MatIcon,
//         MatInput,
//         FormsModule,
//         MatHeaderRow,
//         MatRow,
//         MatHeaderRowDef,
//         MatRowDef,
//         MatDialogActions,
//         MatButton,
//         MatProgressSpinner,
//         MatTooltip,
//         DataInputComponent,
//         GenderSelectComponent,
//         TrueFalseSelectComponent,
//         StudyModalitySelectComponent,
//         UnityMeasureInputComponent,
//         PhoneInputComponent,
//         NgSwitchCase,
//         NgSwitch
//     ]
// })
// export class CriarApplicationEntityComponent {
//     displayedColumns: string[] = ['tag', 'name', 'value', 'actions'];
//     estudoTags: any[] = [];
//     isModified: boolean = false;
//     isLoading = true;
//     dicomEditableTagMap: Record<string, string> = {
//         PregnancyStatus: '001021C0',
//         SmokingStatus: '001021A0',
//         StudyDate: "00080020",
//         StudyModality: "00080061",
//         StudyDescription: "00081030",
//         StudyPriorityID: "0032000C",
//         ReasonForStudy: "00321030",
//         RequestingService: "00321033",
//         StudyComments: "00324000",
//         AdmissionID: "00380010",
//         RequestedProcedureID: "00401001",
//         ProcedureCode: "00081032",
//         RequestingPhysicianPhone: "00080094",
//         PatientTransportArrangements: "00401004",
//         PatientNameIdeographic: "00100010_Ideographic",
//         PatientNamePhonetic: "00100010_Phonetic",
//         OtherPatientNames: "00101001",
//         PatientComments: "00104000",
//         ReasonForTheAttributeModification: "04000565",
//         PatientName: "00100010",
//         PatientBirthDate: "00100030",
//         PatientSex: "00100040",
//         PatientSize: "00101020",
//         PatientWeight: "00101030",
//         PatientTelephoneNumbers: "00102154",
//         PatientEmail: "00100032",
//         PatientInsurancePlan: "00101081",
//         EthnicGroup: "00102160",
//         Occupation: "00102180",
//         MedicalAlerts: "00102000",
//         Allergies: "00102110",
//         AdditionalPatientHistory: "001021B0",
//     };
//     estudoForm: FormGroup;
//     isToggled = false;
//
//     constructor(
//         @Inject(MAT_DIALOG_DATA) public data: { uid: string },
//         public dialogRef: MatDialogRef<CriarApplicationEntityComponent>,
//         public themeService: CustomizerSettingsService,
//         private applicationEntityRepository: ApplicationEntityRepository,
//         private formBuilder: FormBuilder,
//     ) {
//     }
//
//     ngOnInit(): void {
//         this.loadEstudo();
//         this.themeService.isToggled$.subscribe(isToggled => {
//             this.isToggled = isToggled;
//         });
//         this.estudoForm = this.formBuilder.group({
//             StudyDate: [null],
//             StudyModality: [''],
//             StudyDescription: [''],
//             StudyPriorityID: [''],
//             ReasonForStudy: [''],
//             RequestingService: [''],
//             StudyComments: [''],
//             AdmissionID: [''],
//             RequestedProcedureID: [''],
//             ProcedureCode: [''],
//             PregnancyStatus: [null],
//             SmokingStatus: [null],
//             RequestingPhysicianPhone: [''],
//             PatientTransportArrangements: [''],
//             PatientNameIdeographic: [''],
//             PatientNamePhonetic: [''],
//             OtherPatientNames: [''],
//             PatientComments: [''],
//             ReasonForTheAttributeModification: [''],
//             PatientName: [''],
//             PatientBirthDate: [null],
//             PatientSex: [''],
//             PatientSize: [''],
//             PatientWeight: [''],
//             PatientTelephoneNumbers: [''],
//             PatientEmail: [''],
//             PatientInsurancePlan: [''],
//             EthnicGroup: [''],
//             Occupation: [''],
//             MedicalAlerts: [''],
//             Allergies: [''],
//             AdditionalPatientHistory: [''],
//         });
//     }
//
//     getComponentForTag(tagName: string): { component: string; options?: any } | null {
//         return this.tagsInputTypeMap[tagName] || null;
//     }
//
//     private loadEstudo(): void {
//         this.estudoService.getEstudo(this.data.uid).subscribe({
//             next: (estudos) => {
//                 const estudo: Estudo = estudos[0];
//                 this.estudoTags = Object.keys(estudo)
//                     .filter((key) => this.dicomTagMap.hasOwnProperty(key))
//                     .map((key) => {
//                         const typedKey = key as keyof Estudo;
//                         const editable = this.dicomEditableTagMap.hasOwnProperty(key);
//                         return {
//                             tag: this.dicomTagMap[key] || 'N/A',
//                             name: key,
//                             value: estudo[typedKey] || '',
//                             isEditable: editable,
//                             isEditing: false,
//                         };
//                     });
//                 this.isLoading = false;
//             },
//             error: (err) => {
//                 this.isLoading = false;
//             },
//         });
//     }
//
//     enableEditing(tag: any): void {
//         tag.isEditing = true;
//         this.isModified = true;
//     }
//
//     disableEditing(tag: any): void {
//         tag.isEditing = false;
//     }
//
//     onCancel(): void {
//         this.dialogRef.close(); // Fecha o modal sem salvar alterações
//     }
//
//     onSave(): void {
//         const updatedTags = this.estudoTags
//             .filter((tag) => tag.editable)
//             .map(({name, value}) => ({name, value}));
//
//         this.dialogRef.close(updatedTags); // Retorna as alterações
//     }
// }
