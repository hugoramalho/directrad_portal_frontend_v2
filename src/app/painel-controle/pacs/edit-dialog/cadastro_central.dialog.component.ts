import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    standalone: true,
    selector: 'app-create-host-central',
    templateUrl: './cadastro_central.dialog.component.html',
})
export class CreateHostCentralComponent {
    constructor(
        public dialogRef: MatDialogRef<CreateHostCentralComponent>
    ) {}

    save() {
        // Lógica para salvar
        this.dialogRef.close();
    }
}
