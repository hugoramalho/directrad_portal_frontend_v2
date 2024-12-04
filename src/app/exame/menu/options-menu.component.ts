import { Component, Inject, InjectionToken, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-estudos',
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './options-menu.component.html',
  // styleUrl: './options-menu.component.scss'
})
export class MenuEstudosComponent {
  @Input() estudoId: string | undefined;

  executarAcao(acao: string) {
    console.log(`Ação '${acao}' executada no estudo com ID: ${this.estudoId}`);
  }
  
  constructor(
    public dialogRef: MatDialogRef<MenuEstudosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { uid: string }
  ) {}

  uid: string = this.data.uid;

  editar() {
    console.log(`Editar estudo com UID: ${this.uid}`);
    this.dialogRef.close({ action: 'editar', uid: this.uid });
  }

  deletar() {
    console.log(`Excluir estudo com UID: ${this.uid}`);
    this.dialogRef.close({ action: 'deletar', uid: this.uid });
  }

  onClose(): void {
    this.dialogRef.close();
  }

}