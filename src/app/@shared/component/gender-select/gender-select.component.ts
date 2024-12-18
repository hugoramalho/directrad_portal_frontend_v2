import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'app-gender-select',
    standalone: true,
    imports: [CommonModule, MatFormFieldModule, MatSelectModule],
    template: `
        <ng-container *ngIf="useMaterial; else nativeSelect">
            <!-- Angular Material Template -->
            <mat-form-field appearance="fill">
                <mat-label>Gênero</mat-label>
                <mat-select [value]="value" (selectionChange)="onGenderChange($event.value)">
                    <mat-option *ngFor="let option of genderOptions" [value]="option.value">
                        {{ option.label }}
                    </mat-option>
                </mat-select>
            </mat-form-field>
        </ng-container>

        <!-- Native HTML Select -->
        <ng-template #nativeSelect>
            <label for="genderSelect">Gênero:</label>
            <select id="genderSelect" [value]="value" (change)="onGenderChange($event.target.value)">
                <option *ngFor="let option of genderOptions" [value]="option.value">
                    {{ option.label }}
                </option>
            </select>
        </ng-template>
    `,
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
