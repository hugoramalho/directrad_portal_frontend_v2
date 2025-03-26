/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 26/03/2025
 **/

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'emptyValue',
    standalone: true
})
export class EmptyValuePipe implements PipeTransform {
    transform(value: string | null | undefined | number): string | number {
        if (value !== 0 && value == '' || !value) {
            return "<i>Não informado</i>";
        }
        return value;
    }
}
