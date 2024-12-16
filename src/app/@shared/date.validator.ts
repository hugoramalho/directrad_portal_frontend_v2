import {AbstractControl, ValidationErrors} from "@angular/forms";

export function dateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(value)) {
        return { invalidDate: true };
    }
    const [day, month, year] = value.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day || date.getMonth() + 1 !== month || date.getFullYear() !== year) {
        return { invalidDate: true };
    }
    return null;
}
