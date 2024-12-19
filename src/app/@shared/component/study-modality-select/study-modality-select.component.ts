import {booleanAttribute, Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-study-modality-select',
    standalone: true,
    imports: [CommonModule, MatFormFieldModule, MatSelectModule],
    templateUrl: './study-modality-select.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => StudyModalitySelectComponent),
            multi: true,
        },
    ],
    styleUrls: ['./study-modality-select.component.scss'],
})
export class StudyModalitySelectComponent implements ControlValueAccessor {
    @Input() useMaterial: boolean = false; // Se deve usar Angular Material
    @Input() initialValue: string | null= null;
    @Input() label: string = 'Modalidades de Estudo'; // Rótulo do campo
    @Input({transform: booleanAttribute}) multiple: boolean = false; // Permitir múltiplas seleções
    @Output() selectionChange = new EventEmitter<string[] | string>();
    @Input() disabled: boolean = false;


    value: string[] | string = ''; // Valor atual selecionado

    // Lista de modalidades de estudo
    studyModalities = [
        { value: 'US', name: 'Ultrassom (US)' },
        { value: 'CT', name: 'Tomografia Computadorizada (CT)' },
        { value: 'MR', name: 'Ressonância Magnética (MR)' },
        { value: 'DR, DX', name: 'Raio X (DR|DX)' },
        { value: 'MG', name: 'Mamografia (MG)' },
        { value: 'PT', name: 'PET Scan (PT)' },
        { value: 'NM', name: 'Medicina Nuclear (MN)' },
        { value: 'XA', name: 'Angiografia (XA)' },
        { value: 'RF', name: 'Fluoroscopia (RF)' },
        { value: 'BMD', name: 'Densitometria Óssea (BMD)' },
        { value: 'NM', name: 'Cintilografia (NM)' },
    ];

    ngOnInit(): void {
        this.value = this.initialValue ?? '';
    }

    // Callbacks para ControlValueAccessor
    onChange: (value: string[] | string) => void = () => {};
    onTouched: () => void = () => {};

    onSelectionChange(value: string[] | string): void {
        this.value = value;
        this.onChange(value);
        this.selectionChange.emit(value);
        this.onTouched();
    }

    onNativeSelectionChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        const selectedValues = Array.from(target.selectedOptions).map(option => option.value);
        const finalValue = this.multiple ? selectedValues : selectedValues[0];
        this.onSelectionChange(finalValue);
    }

    writeValue(value: string[] | string): void {
        this.value = value || (this.multiple ? [] : '');
    }

    registerOnChange(fn: (value: string[] | string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
}
