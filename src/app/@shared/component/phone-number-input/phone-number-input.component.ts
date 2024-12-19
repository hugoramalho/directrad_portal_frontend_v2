import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-phone-input',
    standalone: true,
    imports: [CommonModule, MatFormFieldModule, MatInputModule],
    templateUrl: 'phone-number-input.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PhoneInputComponent),
            multi: true,
        },
    ],
    styleUrls: ['./phone-number-input.component.scss'],
})
export class PhoneInputComponent implements ControlValueAccessor {
    @Input() useMaterial: boolean = false; // Define o estilo do input
    @Input() initialValue: string | null = null;
    @Input() label: string = 'Telefone'; // Rótulo
    @Input() placeholder: string = '+XX (XX) XXXXX-XXXX'; // Placeholder do input
    @Input() disabled: boolean = false;

    private _value: string = ''; // Valor interno
    displayValue: string = ''; // Valor formatado para exibição no input

    ngOnInit(): void {
        this.value = this.initialValue ?? '';
    }

    // Callbacks para ControlValueAccessor
    onChange = (value: string) => {};
    onTouched = () => {};

    writeValue(value: string | null): void {
        this._value = value || '';
        this.displayValue = this.formatPhoneNumber(this._value);
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    onInputChange(event: Event): void {
        const input = (event.target as HTMLInputElement).value;

        // Remove todos os caracteres não numéricos
        const cleanedInput = input.replace(/\D+/g, '');

        // Aplica a formatação (código do país, área e número)
        const formatted = this.formatPhoneNumber(cleanedInput);

        this.displayValue = formatted;
        this._value = cleanedInput;
        this.onChange(cleanedInput);
    }

    private formatPhoneNumber(value: string): string {
        // Formata o telefone no padrão: +XX (XX) XXXXX-XXXX
        let formatted = value;

        if (value.length > 0) formatted = '+' + value.substring(0, 2); // Código do país
        if (value.length > 2) formatted += ' (' + value.substring(2, 4); // Área
        if (value.length > 4) formatted += ') ' + value.substring(4, 9); // Primeiros 5 números
        if (value.length > 9) formatted += '-' + value.substring(9, 13); // Últimos 4 números

        return formatted;
    }

    restrictToNumbers(event: KeyboardEvent): void {
        const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
        const isNumber = /^[0-9]$/.test(event.key);

        if (!isNumber && !allowedKeys.includes(event.key)) {
            event.preventDefault(); // Impede a entrada de caracteres não permitidos
        }
    }
}
