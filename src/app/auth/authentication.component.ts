import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-authentication',
    standalone: true,
    imports: [RouterLink, RouterOutlet],
    templateUrl: './authentication.component.html',
})
export class AuthenticationComponent {}
