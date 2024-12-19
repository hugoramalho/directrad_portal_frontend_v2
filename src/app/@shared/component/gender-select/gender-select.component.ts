import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'app-gender-select',
    standalone: true,
    imports: [CommonModule, MatFormFieldModule, MatSelectModule],
    templateUrl: 'gender-select.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => GenderSelectComponent),
            multi: true
        }
    ],
    styleUrls: ['./gender-select.component.scss']
})
export class GenderSelectComponent implements ControlValueAccessor {
    @Input() useMaterial: boolean = false; // Se deve usar Angular Material
    @Input() disabled: boolean = false; // Se deve usar Angular Material
    @Input() initialValue: string | null = null;
    value: string = ''; // Valor selecionado

    // Opções de gênero
    genderOptions = [
        { value: 'M', label: 'Masculino' },
        { value: 'F', label: 'Feminino' },
        { value: 'O', label: 'Outro' }
    ];

    // Funções de callback para o ControlValueAccessor
    onChange: (value: string) => void = () => {};
    onTouched: () => void = () => {};

    onGenderChange(value: string): void {
        this.value = value; // Atualiza o valor local
        this.onChange(value); // Notifica o Angular sobre a mudança
        this.onTouched(); // Marca o campo como "tocado"
    }

    onNativeGenderChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        const value = target?.value || '';
        this.onGenderChange(value); // Reutiliza a lógica do Angular Material
    }

    writeValue(value: string): void {
        this.value = value || '';
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
}
