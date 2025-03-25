import {Component, ElementRef, EventEmitter, forwardRef, Input, Output, Renderer2, ViewChild} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-data-input',
    standalone: true,
    templateUrl: './date-input.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DataInputComponent),
            multi: true,
        },
    ],
    imports: [CommonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule],
})
export class DataInputComponent implements ControlValueAccessor {
    @Input() label: string = 'Data';
    @Input() placeholder: string = 'dia/mês/ano';
    @Input() useMaterial: boolean = false; // Define o uso de Material Design
    @Output() dateChange = new EventEmitter<Date>();
    @Input() disabled: boolean = false;
    @Input() initialValue: string | null = null;
    @Input() dateFormat: string = 'Y-m-d';

    @ViewChild('picker') picker: any;
    @ViewChild('inputElement') inputElement!: ElementRef;

    private _value: Date | undefined = undefined;
    displayValue: string = ''; // Valor formatado para exibição no input

    // Callbacks para ControlValueAccessor
    onChange = (value: Date | undefined) => {};
    onTouched = () => {};

    constructor(private renderer: Renderer2) {}

    // Propriedade de entrada e saída de valor
    get value(): Date | undefined {
        return this._value;
    }

    set value(value: Date | undefined) {
        this._value = value;
        this.displayValue = this.formatDateToDisplay(value);
        this.onChange(value);
        this.dateChange.emit(value);
    }

    writeValue(value: Date | undefined): void {
        this.value = value;
    }

    registerOnChange(fn: (value: Date | undefined) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {}

    formatDateInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D+/g, ''); // Remove caracteres não numéricos

        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        if (value.length > 5) {
            value = value.slice(0, 5) + '/' + value.slice(5);
        }

        this.displayValue = value.slice(0, 10);
    }

    validateAndSetDate(event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = input.value;

        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!regex.test(value)) {
            this.value = undefined; // Define como undefined se a data for inválida
            return;
        }

        const [day, month, year] = value.split('/').map(Number);
        const date = new Date(year, month - 1, day);

        // Valida a data criada
        if (
            date.getFullYear() === year &&
            date.getMonth() + 1 === month &&
            date.getDate() === day
        ) {
            this.value = date;
        } else {
            this.value = undefined; // Define como undefined se a data for inválida
        }
    }

    restrictToNumbers(event: KeyboardEvent): void {
        const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
        const isNumber = /^[0-9]$/.test(event.key);

        if (!isNumber && !allowedKeys.includes(event.key)) {
            event.preventDefault();
        }
    }

    onMaterialDateSelected(picker: any): void {
        const selectedDate = picker._selected;
        if (selectedDate instanceof Date) {
            this.value = selectedDate;
        }
    }

    onNativeDateSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = input.value;

        if (value) {
            const [year, month, day] = value.split('-').map(Number);
            this.value = new Date(year, month - 1, day);
        }
    }

    openCalendar(event: any) {
        const inputElement = this.inputElement.nativeElement;
        const rect = inputElement.getBoundingClientRect(); // Pega a posição do input na tela

        // Aqui estamos utilizando o `Renderer2` para modificar o estilo do picker
        this.renderer.setStyle(this.picker._datepickerRef._overlayRef.overlayElement, 'top', `${rect.bottom + window.scrollY}px`);
        this.renderer.setStyle(this.picker._datepickerRef._overlayRef.overlayElement, 'left', `${rect.left + window.scrollX}px`);
        this.picker.open(); // Abre o calendário
    }

    private formatDateToDisplay(date: Date | string | undefined): string {
        if (!date) return '';
        // Se for string, converte para Date
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        // Verifica se é um Date válido
        if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
            return '';
        }
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`;
    }
}
