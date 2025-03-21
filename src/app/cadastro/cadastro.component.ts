/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 21/03/2025
 **/

import {Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
    selector: 'app-cadastro',
    standalone: true,
    imports: [
        MatCardModule,
        MatTabsModule,
        MatFormFieldModule,
    ],
    templateUrl: './cadastro.component.html',
})
export class CadastroComponent {
}
