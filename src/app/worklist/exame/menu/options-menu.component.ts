// import {Component, Inject} from '@angular/core';
// import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// import {FormControl, FormGroup} from '@angular/forms';
// import {Estudo} from "../estudos";
// import {EstudoRepository} from "../estudos.service";
//
// @Component({
//     standalone: true,
//     selector: 'app-edit-dialog',
//     templateUrl: './edit-dialog.component.html',
//     styleUrls: ['./edit-dialog.component.scss']
// })
// export class EditDialogComponent {
//     attributesForm: FormGroup;
//     isEdited: boolean = false;
//     estudo: Estudo | null = null;
//     public uid: string = this.data.uid;
//
//     constructor(
//         public dialogRef: MatDialogRef<EditDialogComponent>,
//         private estudoRepository: EstudoRepository,
//         @Inject(MAT_DIALOG_DATA) public data: any
//     ) {
//         // Cria o FormGroup baseado nos atributos passados pelo data
//         this.attributesForm = new FormGroup(
//             data.attributes.reduce((controls: any, attr: any) => {
//                 controls[attr.tag] = new FormControl(attr.value);
//                 return controls;
//             }, {})
//         );
//     }
//
//     private loadExames(): void {
//         this.estudoRepository.getEstudo(this.uid).subscribe({
//             next: (exames: Estudo[]) => {
//                 this.estudo = exames[0];
//                 console.log('this.estudo', this.estudo);
//             },
//             error: (error) => {
//                 console.error('Erro ao carregar os exames:', error);
//             }
//         });
//     }
//
//     ngOnInit(): void {
//         this.loadExames();
//     }
//
//     enableEdit(tag: string): void {
//         this.attributesForm.controls[tag].enable();
//         this.isEdited = true; // Marca que algo foi editado
//     }
//
//     save(): void {
//         const updatedAttributes = Object.keys(this.attributesForm.controls).map(tag => ({
//             tag,
//             value: this.attributesForm.get(tag)?.value
//         }));
//         this.dialogRef.close(updatedAttributes);
//     }
//
//     cancel(): void {
//         this.dialogRef.close();
//     }
// }


import {Component, Inject, InjectionToken, Input} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {MatButton} from "@angular/material/button";
import {WorklistService} from "../worklist.service";
import {Estudo} from "../worklist";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow, MatTable
} from "@angular/material/table";
import {MatFormField} from "@angular/material/form-field";

@Component({
    selector: 'app-menu-estudos',
    standalone: true,
    imports: [
        MatMenuModule,
        MatIconModule,
        MatDialogModule,
        MatButton,
        MatHeaderRow,
        MatRow,
        MatHeaderCell,
        MatColumnDef,
        MatCell,
        MatFormField,
        MatCellDef,
        MatHeaderCellDef,
        MatTable,
    ],
    templateUrl: './options-menu.component.html',
    styleUrl: './options-menu.component.scss'
})
export class MenuEstudosComponent {
    @Input() estudoId: string | undefined;

    public uid: string = this.data.uid;
    public estudo: Estudo | null = null;

    executarAcao(acao: string) {
        console.log(`Ação '${acao}' executada no estudo com ID: ${this.estudoId}`);
    }

    constructor(
        public dialogRef: MatDialogRef<MenuEstudosComponent>,
        private estudoRepository: WorklistService,
        @Inject(MAT_DIALOG_DATA) public data: { uid: string }
    ) {
        // this.themeService.isToggled$.subscribe(isToggled => {
        //     this.isToggled = isToggled;
        // });
    }


    private loadExames(): void {
        this.estudoRepository.getEstudo(this.uid).subscribe({
            next: (exames: Estudo[]) => {
                this.estudo = exames[0];
            },
            error: (error) => {
                console.error('Erro ao carregar os exames:', error);
            }
        });
    }

    ngOnInit(): void
    {
        this.loadExames(); // Carregar os dados ao inicializar
    }

    editar()
    {
        this.dialogRef.close({action: 'editar', uid: this.uid});
    }

    deletar()
    {
        this.dialogRef.close({action: 'deletar', uid: this.uid});
    }

    onClose(): void {
        this.dialogRef.close();
    }

}
