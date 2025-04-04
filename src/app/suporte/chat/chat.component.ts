import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import {CustomizerSettingsService} from "../../customizer-settings/customizer-settings.service";
import {HttpClient} from "@angular/common/http";
import {MercureService} from "../../@shared/externals/mercure.service";
import {first, forkJoin} from "rxjs";
import {MatOption} from "@angular/material/autocomplete";

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatMenuModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatTabsModule, MatOption],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss'
})
export class ChatComponent {
    contactList: { name: string; avatar: string }[] = [];
    messages: { username: string; message: string }[] = [];
    newMessage: string = '';
    username: string = 'User' + Math.floor(Math.random() * 1000);
    isToggled = false;



    constructor(
        public themeService: CustomizerSettingsService,
        private http: HttpClient,
        private mercureService: MercureService
    ) {
        const isToggled$ = this.themeService.isToggled$.pipe(first());
        // const messages$ = this.mercureService.subscribeToTopic('/chat').pipe(first());

        // Combinar os observáveis e aguardar a conclusão
        // forkJoin([isToggled$, messages$]).subscribe(([isToggled, initialMessages]) => {
        //     this.isToggled = isToggled;
        //     this.messages.push(...initialMessages);
        // });
    }

    sendMessage(): void {
        if (this.newMessage.trim()) {
            this.http.post('/api/chat/send', {
                username: this.username,
                message: this.newMessage,
            }).subscribe();
            this.newMessage = '';
        }
    }

    // Dark Mode
    toggleTheme() {
        this.themeService.toggleTheme();
    }

    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}
