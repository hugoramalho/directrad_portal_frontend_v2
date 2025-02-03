import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import {AuthService} from "../auth/auth.service";

export const AuthGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    if (authService.isAuthenticated()) {
        return true;
    } else {
        // Redireciona para a página de login ou outra ação apropriada
        return false;
    }
};
