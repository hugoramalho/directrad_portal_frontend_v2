import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-gender-select',
    standalone: true,
    imports: [MatFormFieldModule, MatSelectModule, CommonModule],
    template: `
        <mat-form-field appearance="fill">
            <mat-label>Gênero</mat-label>
            <mat-select [value]="selectedGender" (selectionChange)="onGenderChange($event.value)">
                <mat-option *ngFor="let option of genderOptions" [value]="option.value">
                    {{ option.label }}
                </mat-option>
            </mat-select>
        </mat-form-field>
    `,
    styleUrls: ['./gender-select.component.scss']
})
export class GenderSelectComponent {
    @Input() selectedGender: string | null = null; // Gênero selecionado inicialmente
    @Output() genderChange = new EventEmitter<string>(); // Emite o valor selecionado para o componente pai

    // Opções de gênero
    genderOptions = [
        { value: 'M', label: 'Masculino' },
        { value: 'F', label: 'Feminino' },
        { value: 'O', label: 'Outro' }
    ];

    onGenderChange(value: string) {
        this.genderChange.emit(value); // Emite o valor para o componente pai
    }
}
