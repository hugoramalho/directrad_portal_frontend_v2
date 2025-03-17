import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {UserService} from "../service/usuario/user.service";

export const adminGuard: CanActivateFn = (route, state) => {
    const userService = inject(UserService);
    const router = inject(Router);

    if (userService.isAdmin()) {
        return true;
    }

    router.navigate(['/home']);
    return false;
};
