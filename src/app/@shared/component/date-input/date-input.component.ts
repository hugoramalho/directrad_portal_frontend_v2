import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
    selector: 'app-data-input',
    standalone: true,
    template: `
    <ng-container *ngIf="useMaterial; else nativeInput">
      <!-- Material Template -->
      <mat-form-field appearance="fill">
        <mat-label>{{ label }}</mat-label>
        <input
          matInput
          [placeholder]="placeholder"
          maxlength="10"
          [matDatepicker]="picker"
          [value]="displayValue"
          (input)="formatDateInput($event)"
          (blur)="validateAndSetDate($event)"/>
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
    </ng-container>

    <!-- Native Template -->
    <ng-template #nativeInput>
      <label>{{ label }}</label>
      <input
        type="text"
        [placeholder]="placeholder"
        maxlength="10"
        [value]="displayValue"
        (input)="formatDateInput($event)"
        (blur)="validateAndSetDate($event)"
      />
    </ng-template>
  `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DataInputComponent),
            multi: true,
        },
    ],
    imports: [CommonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
})
export class DataInputComponent implements ControlValueAccessor {
    @Input() label: string = 'Data';
    @Input() placeholder: string = 'DD/MM/YYYY';
    @Input() useMaterial: boolean = false; // Define o uso de Material Design
    @Output() dateChange = new EventEmitter<Date>();

    private _value: Date | null = null;
    displayValue: string = ''; // Valor formatado para exibição no input

    // Callbacks para ControlValueAccessor
    onChange = (value: Date | null) => {};
    onTouched = () => {};

    // Propriedade de entrada e saída de valor
    get value(): Date | null {
        return this._value;
    }

    set value(value: Date | null) {
        this._value = value;
        this.displayValue = this.formatDateToDisplay(value);
        this.onChange(value);
        // this.dateChange.emit(value);
    }

    writeValue(value: Date | null): void {
        this.value = value;
    }

    registerOnChange(fn: (value: Date | null) => void): void {
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
            this.value = null; // Define como nulo se a data for inválida
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
            this.value = null; // Define como nulo se a data for inválida
        }
    }

    private formatDateToDisplay(date: Date | null): string {
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}
