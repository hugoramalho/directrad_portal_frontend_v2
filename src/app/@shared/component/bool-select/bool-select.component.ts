import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {MatDatepickerInput} from "@angular/material/datepicker";
import {MatInput} from "@angular/material/input";

@Component({
    selector: 'app-bool-select',
    standalone: true,
    imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatDatepickerInput, MatInput],
    templateUrl: './bool-select.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TrueFalseSelectComponent),
            multi: true
        }
    ],
    styleUrls: ['./bool-select.component.scss']
})
export class TrueFalseSelectComponent implements ControlValueAccessor {
    @Input() useMaterial: boolean = false; // Define o uso do Material Design
    @Input() label: string = 'Escolha'; // Rótulo do campo
    @Input() disabled: boolean = false;
    @Input() initialValue: boolean | null = null;

    value: boolean | null = null;

    // Opções do select
    options = [
        { value: true, label: 'Positivo' },
        { value: false, label: 'Negativo' }
    ];

    // Callbacks para o ControlValueAccessor
    onChange: (value: boolean | null) => void = () => {};
    onTouched: () => void = () => {};

    onInit(){

    }

    onValueChange(value: boolean): void {
        this.value = value;
        this.onChange(value);
        this.onTouched();
    }

    onNativeValueChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        const value = target.value === 'true'; // Converte para boolean
        this.onValueChange(value);
    }

    writeValue(value: boolean | null): void {
        this.value = value;
    }

    registerOnChange(fn: (value: boolean | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
}
