import { Component, Inject, InjectionToken, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatMenu } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-basic-menu',
  standalone: true,
  imports: [
    MatMenu,
    MatIcon
  ],
  templateUrl: './options-menu.component.html',
  styleUrl: './options-menu.component.scss'
})
export class MenuContextoEstudosComponent {
  @Input() estudoId: string | undefined;

  executarAcao(acao: string) {
    console.log(`Ação '${acao}' executada no estudo com ID: ${this.estudoId}`);
  }
  
  constructor(
    public dialogRef: MatDialogRef<MenuContextoEstudosComponent>,
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


}