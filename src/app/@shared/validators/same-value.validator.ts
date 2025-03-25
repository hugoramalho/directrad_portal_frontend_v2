/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 24/03/2025
 **/

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// No seu componente ou em um arquivo de utilitários
export function sameValueValidator(
    campo1: string,
    campo2: string
): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const valorCampo1 = formGroup.get(campo1)?.value;
        const valorCampo2 = formGroup.get(campo2)?.value;

        if (valorCampo1 !== valorCampo2) {
            formGroup.get(campo2)?.setErrors({ differentValues: true });
            return { differentValues: true };
        }
        formGroup.get(campo2)?.setErrors(null);
        return null;
    };
}
