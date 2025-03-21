import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
    standalone: true,
    selector: 'app-create-host-central',
    templateUrl: './cadastro_central.dialog.component.html',
    styleUrls: ['./cadastro_central.dialog.component.scss'],
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatFormField,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
        MatSlideToggle,
        NgIf,
        ReactiveFormsModule
    ]
})
export class CreateHostCentralComponent {
    pacsForm: FormGroup;
    constructor(
        public dialogRef: MatDialogRef<CreateHostCentralComponent>,
        private formBuilder: FormBuilder,
    ) {}

    save() {
        // Lógica para salvar
        this.dialogRef.close();
    }

    onCancel()
    {
        this.dialogRef.close();
    }
}
