import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {AuthInterceptor} from "./@shared/interceptors/auth.interceptor";
import {HttpErrorInterceptor} from "./@shared/interceptors/http-error.interceptor";

registerLocaleData(localePt);

export const CUSTOM_DATE_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY', // Formato aceito ao digitar a data
    },
    display: {
        dateInput: 'DD/MM/YYYY', // Formato exibido no campo
        monthYearLabel: 'MMMM YYYY', // Formato do cabeçalho do datepicker
        dateA11yLabel: 'DD/MM/YYYY', // Formato para acessibilidade
        monthYearA11yLabel: 'MMMM YYYY', // Formato do cabeçalho para acessibilidade
    },
};



export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideClientHydration(),
        provideAnimations(),
        importProvidersFrom(HttpClientModule, MatNativeDateModule),
        { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
    ]
};
