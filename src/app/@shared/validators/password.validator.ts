/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 24/03/2025
 **/

import { AbstractControl, ValidatorFn } from '@angular/forms';

export class PasswordValidators
{
    static hasUpperAndLowerCase(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (!control.value) return null;

            const hasLower = /[a-z]/.test(control.value);
            const hasUpper = /[A-Z]/.test(control.value);

            return hasLower && hasUpper ? null : { hasUpperAndLowerCase: true };
        };
    }

    static hasNumber(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (!control.value) return null;
            return /\d/.test(control.value) ? null : { hasNumber: true };
        };
    }

    static hasSpecialCharacter(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (!control.value) return null;
            return /[^\w]/.test(control.value) ? null : { hasSpecialCharacter: true };
        };
    }
}
