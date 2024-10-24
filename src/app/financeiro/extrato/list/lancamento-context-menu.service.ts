// import {NbMenuService} from '@nebular/theme';
// import {Subject} from 'rxjs';
// import {filter} from 'rxjs/operators';
// import {Injectable} from '@angular/core';
//
// @Injectable({
//   providedIn: 'root',
// })
// export class ContextMenuService {
//   private actionSubject = new Subject<any>();
//
//   constructor(private menuService: NbMenuService) {
//     this.menuService.onItemClick()
//       .pipe(filter(event => event.tag === 'lancamento-context-menu'))
//       .subscribe(event => {
//         this.actionSubject.next(event);
//       });
//   }
//
//   getAction() {
//     return this.actionSubject.asObservable();
//   }
// }
