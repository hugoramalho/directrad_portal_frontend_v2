import { Component, Inject } from '@angular/core';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent, MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgSwitch, NgSwitchCase, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatLabel} from "@angular/material/form-field";

@Component({
    standalone: true,
    selector: 'app-add-aetitle',
    templateUrl: './create-aetitle.component.html',
    styleUrls: ['./create-aetitle.component.scss'],
    imports: [
        MatFormField,
        FormsModule,
        MatOption,
        MatSelect,
        NgForOf,
        NgIf,
        NgSwitchCase,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        MatInput,
        MatSlideToggle,
        NgSwitch,
        MatDialogContent,
        MatDialogTitle,
        MatLabel
    ]

})
export class CreateAetitleComponent {
    aetitleType: string = 'export'; // Default type
    exportData = {
        aetitle: '',
        useExisting: true,
        selectedDestination: '',
        newDestination: {
            aetitle: '',
            host: '',
            port: null,
        },
    };

    storageData = {
        aetitle: '',
        permissions: [],
    };

    destinations = [
        { id: 1, name: 'PACS Central' },
        { id: 2, name: 'PACS Backup' },
    ];

    permissions = [
        { id: 1, name: 'Viewer Aetitle 1' },
        { id: 2, name: 'Viewer Aetitle 2' },
    ];

    constructor(
        public dialogRef: MatDialogRef<CreateAetitleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    onTypeChange() {
        // Reset data when type changes
        if (this.aetitleType === 'export') {
            this.exportData = {
                aetitle: '',
                useExisting: true,
                selectedDestination: '',
                newDestination: {
                    aetitle: '',
                    host: '',
                    port: null,
                },
            };
        } else if (this.aetitleType === 'storage') {
            this.storageData = {
                aetitle: '',
                permissions: [],
            };
        }
    }

    onSwitchChange() {
        this.exportData.selectedDestination = '';
        this.exportData.newDestination = {
            aetitle: '',
            host: '',
            port: null,
        };
    }

    onSave() {
        const result = {
            type: this.aetitleType,
            data: this.aetitleType === 'export' ? this.exportData : this.storageData,
        };
        this.dialogRef.close(result);
    }
}
