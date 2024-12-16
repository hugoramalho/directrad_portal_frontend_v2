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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {EstudoRepository} from "../exame.service";

@Component({
    standalone: true,
    selector: 'app-edit-estudo-modal',
    templateUrl: './estudo-modal.component.html',
    styleUrls: ['./estudo-modal.component.scss'],
})
export class EditarEstudoModalComponent {
    displayedColumns: string[] = ['tag', 'name', 'value', 'actions'];
    estudoTags: any[] = [];
    isModified: boolean = false;

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
            next: (estudo) => {
                console.log(estudo);
                // this.estudoTags = estudo.tags.map((tag: any) => ({
                //     ...tag,
                //     isEditing: false, // Controla o estado de edição
                // }));
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
            .map(({ tag, value }) => ({ tag, value }));

        this.dialogRef.close(updatedTags); // Retorna as alterações
    }
}
