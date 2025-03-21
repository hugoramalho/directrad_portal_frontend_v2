import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {PacsService} from "../../../@shared/service/pacs/pacs.service";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
    standalone: true,
    selector: 'app-create-host-central',
    templateUrl: './edit-pacs.dialog.component.html',
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
export class EditPacsDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<EditPacsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { pacs_id: number },
        private pacsService: PacsService
    ) {}

    save() {
        // Lógica para salvar
        this.dialogRef.close();
    }

    loadPacs(pacs_id: number)
    {
        console.log('Carregar dados do PACS com ID:', pacs_id);
        // Exemplo de chamada ao serviço para buscar dados do PACS
        // this.pacsService.getPacsById(pacs_id).subscribe(pacs => {
        //     this.pacsData = { ...pacs }; // Atualiza os dados do modal
        // });
    }
}
