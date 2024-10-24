/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 05/05/2024
 **/

import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
    selector: 'app-aluno',
    template: `
        <router-outlet></router-outlet>
    `,
    imports: [
        RouterOutlet
    ],
    standalone: true
})
export class AlunoComponent {
}
