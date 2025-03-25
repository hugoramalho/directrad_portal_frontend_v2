// import {Component, Input, OnInit} from '@angular/core';
// import { Lancamento } from '../../../../@shared/model/financeiro/lancamento';
// import {NbDialogService, NbMenuItem, NbMenuService} from '@nebular/theme';
// import {EditarLancamentoDialogComponent} from './edit-dialog/menu-dialog.component';
// import {ContextMenuService} from "./lancamento-context-menu.service";
// import {Router} from "@angular/router";
//
//
// @Component({
//   selector: 'app-lancamento-item',
//   templateUrl: './lancamento-item.component.html',
//   styleUrls: ['./lancamento-item.component.scss'],
// })
// export class LancamentoItemComponent  {
//
//   menuItems = [];
//   @Input() lancamento: Lancamento;
//   private dialogAberto: boolean;
//   // constructor(private dialogService: NbDialogService) {}
//
//   constructor(private router: Router) {
//     this.menuItems = [
//       { title: 'Editar', data: { action: 'edit', item: this.lancamento }},
//       { title: 'Excluir', data: { action: 'delete', item: this.lancamento } },
//     ];
//   }
//
//   // openEditDialog(lancamento: Lancamento) {
//   //   this.dialogService.open(LancamentoDialogComponent, { context: { lancamento } })
//   //     .onClose.subscribe((updatedLancamento: Lancamento) => {
//   //     if (updatedLancamento) {
//   //       // this.lancamentosRepo.update(lancamento);
//   //     }
//   //   });
//   // }
//
//
//   // constructor(private dialogService: NbDialogService, private contextMenuService: ContextMenuService) {
//   //   this.contextMenuService.getAction().subscribe((event) => {
//   //     const { action, item } = event.item.data;
//   //     if (action === 'edit') {
//   //       this.dialogService.open(LancamentoDialogComponent, { context: { lancamento: item } });
//   //     } else if (action === 'delete') {
//   //     }
//   //   });
//   // }
// }
//
