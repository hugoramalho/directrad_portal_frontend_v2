// import { Component, Inject, InjectionToken, Input } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { MatMenu } from '@angular/material/menu';
// import { MatIcon } from '@angular/material/icon';
// import { EstudoRepository } from '../exame.service';
//
//
// @Component({
//   selector: 'app-basic-menu',
//   standalone: true,
//   imports: [
//     MatMenu,
//     MatIcon,
//
//   ],
//   templateUrl: './options-menu.component.html',
//   styleUrl: './options-menu.component.scss'
// })
// export class MenuContextoEstudosComponent {
//   @Input() estudoId: string | undefined;
//
//   executarAcao(acao: string) {
//     console.log(`Ação '${acao}' executada no estudo com ID: ${this.estudoId}`);
//   }
//
//   constructor(
//     public dialogRef: MatDialogRef<MenuContextoEstudosComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: { uid: string }
//   ) {}
//
//   uid: string = this.data.uid;
//
//   editar() {
//     console.log(`Editar estudo com UID: ${this.uid}`);
//     this.dialogRef.close({ action: 'editar', uid: this.uid });
//   }
//
//   deletar() {
//     console.log(`Excluir estudo com UID: ${this.uid}`);
//     this.dialogRef.close({ action: 'deletar', uid: this.uid });
//   }
//
//
// }

import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions} from '@angular/material/dialog';
import {EstudoRepository} from "../exame.service";
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
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {TagDicom} from "../tag-dicom";
import {Estudo} from "../exame";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

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
        MatProgressSpinner
    ]
})
export class EditarEstudoModalComponent {
    displayedColumns: string[] = ['tag', 'name', 'value', 'actions'];
    estudoTags: any[] = [];
    isModified: boolean = false;
    isLoading = true;

    dicomTagMap: Record<string, string> = {
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
        AttriduteModificationDateTime: "04000562",
        ModifyingSystem: "04000563",
        SourceOfPreviousValues: "04000564",
        ReasonForTheAttributeModification: "04000565",
        PatientID: "00100020",
        PatientName: "00100010",
        PatientBirthDate: "00100030",
        PatientSex: "00100040",
        PatientAge: "00101010",
        PatientSize: "00101020",
        PatientWeight: "00101030",
        PatientAddress: "00101040",
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


    constructor(
        public dialogRef: MatDialogRef<EditarEstudoModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { uid: string },
        private estudoService: EstudoRepository
    ) {}

    ngOnInit(): void {
        this.loadEstudo();
    }

    private loadEstudo(): void {
        this.estudoService.getEstudo(this.data.uid).subscribe({
            next: (estudos) => {
                const estudo: Estudo = estudos[0];
                this.estudoTags = Object.keys(estudo).map((key) => {
                    const typedKey = key as keyof Estudo; // Garantimos que a key é uma chave de Estudo
                    return {
                        tag: this.dicomTagMap[key] || 'N/A',
                        name: key,
                        value: estudo[typedKey] || '', // Usamos o typedKey aqui
                        editable: true, // Define se a tag é editável
                        isEditing: false, // Controla o estado de edição
                    };
                });
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Erro ao carregar o estudo:', err);
            },
        });
    }

    enableEditing(tag: any): void {
        tag.isEditing = true;
        this.isModified = true;
    }

    disableEditing(tag: any): void {
        tag.isEditing = false;
    }

    onCancel(): void {
        this.dialogRef.close(); // Fecha o modal sem salvar alterações
    }

    onSave(): void {
        const updatedTags = this.estudoTags
            .filter((tag) => tag.editable)
            .map(({ name, value }) => ({ name, value }));

        this.dialogRef.close(updatedTags); // Retorna as alterações
    }
}
