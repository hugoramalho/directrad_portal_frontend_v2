import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import {MatIcon} from "@angular/material/icon";

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatIcon],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {}
