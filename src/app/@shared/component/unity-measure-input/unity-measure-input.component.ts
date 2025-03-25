import {Component, EventEmitter, Input, Output, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {MatFormField} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {MatInput} from "@angular/material/input";
import {MatLabel} from "@angular/material/form-field";
import {MatDatepickerInput} from "@angular/material/datepicker";

@Component({
    standalone: true,
    selector: 'app-unity-measure-input',
    templateUrl: './unity-measure-input.component.html',
    styleUrls: ['./unity-measure-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UnityMeasureInputComponent),
            multi: true,
        },
    ],
    imports: [
        MatFormField,
        MatSelect,
        MatOption,
        NgForOf,
        MatTooltip,
        MatInput,
        NgIf,
        MatDatepickerInput
    ]
})
export class UnityMeasureInputComponent implements ControlValueAccessor {
    @Input() label: string = 'Valor';
    @Input() initialValue: string | null = null;
    @Input() disabled: boolean = false;
    @Input() placeholder: string = '';
    @Input() useMaterial: boolean = false; // Define o uso de Material Design
    @Input() unitOptions: { value: string; label: string }[] = [{value: 'cm', label: 'Centímetros'}]; // Lista de unidades de medida inicializada
    @Input() selectedUnit: string = ''; // Unidade atualmente selecionada
    @Input() maxDecimals: number = 2; // Número máximo de casas decimais permitidas (padrão: 2)
    @Output() unitChange = new EventEmitter<string>(); // Evento para mudança de unidade

    displayValue: string = ''; // Valor exibido no input

    ngOnInit(): void {
        if (!this.initialValue && this.unitOptions && this.unitOptions.length === 1) {
            this.selectedUnit = this.unitOptions[0].value;
        }
    }

    // ControlValueAccessor callbacks
    onChange = (value: string) => {};
    onTouched = () => {};

    // Métodos do ControlValueAccessor
    writeValue(value: string): void {
        this.displayValue = value;
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    restrictToNumbers(event: KeyboardEvent): void {
        const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
        const isNumber = /^[0-9]$/.test(event.key);

        // Permite apenas números, teclas de controle e ponto decimal
        // if (!isNumber && !allowedKeys.includes(event.key) && event.key !== '.') {
        if (!isNumber && !allowedKeys.includes(event.key)) {
            event.preventDefault(); // Impede a entrada de caracteres não permitidos
            return;
        }

        const currentValue = this.displayValue || '';
        const cursorPosition = (event.target as HTMLInputElement).selectionStart || 0;

        // Se já existe um ponto decimal, divide a string para validação
        // const [integerPart, decimalPart] = currentValue.split('.');

        // Calcula o número total de dígitos (excluindo o ponto)
        const totalDigits = (this.displayValue).length;

        console.log('console 1', this.displayValue, totalDigits);
        console.log('console 2', totalDigits, this.maxDecimals);
        console.log('totalDigits >= this.maxDecimals && isNumber', totalDigits >= this.maxDecimals && isNumber);
        // Verifica se o número de dígitos excede o máximo permitido
        if (totalDigits >= this.maxDecimals && isNumber) {
            event.preventDefault();
            return;
        }

        // Impede mais de um ponto decimal
        if (event.key === '.' && currentValue.includes('.')) {
            event.preventDefault();
        }

        // Impede que o número exceda o tamanho máximo ao incluir o novo caractere
        if (
            isNumber &&
            currentValue.length >= this.maxDecimals &&
            (!currentValue.includes('.') || cursorPosition <= currentValue.indexOf('.'))
        ) {
            event.preventDefault();
        }
    }



    onInputChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value;

        // Limita o número de casas decimais permitidas
        // const regex = new RegExp(`^\d*(\.\d{0,${this.maxDecimals}})?$`);
        // if (!regex.test(value)) {
        //     value = this.displayValue; // Restaura o último valor válido
        // }

        this.displayValue = value;
        this.onChange(this.displayValue);
        this.onTouched();
    }

    onUnitChange(newUnitEvent: Event): void {
        if (!newUnitEvent) {
            return; // Caso o evento seja nulo
        }
        // Verifica se o alvo do evento é um HTMLSelectElement
        const target = newUnitEvent.target as HTMLSelectElement | null;
        if (!target) {
            return; // Caso o alvo do evento não seja um select válido
        }
        const newUnit = target.value; // Captura o valor selecionado
        this.selectedUnit = newUnit;
        this.unitChange.emit(newUnit);
        this.onTouched();
    }

    getUnitFullName(unit: string): string {
        const selected = this.unitOptions.find((option) => option.value === unit);
        return selected ? selected.label : '';
    }
}
