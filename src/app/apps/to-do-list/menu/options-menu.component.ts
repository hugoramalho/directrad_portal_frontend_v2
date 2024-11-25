import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-basic-menu',
  standalone: true,
  imports: [],
  templateUrl: './options-menu.component.ts',
  styleUrl: './options-menu.component.scss'
})
export class optionsMenuEstudosComponent {
  @Input() estudoId: string | undefined;

  executarAcao(acao: string) {
    console.log(`Ação '${acao}' executada no estudo com ID: ${this.estudoId}`);
  }
  
}
