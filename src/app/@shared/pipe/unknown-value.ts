/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 27/03/2025
 **/


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'unknownValue',
    standalone: true
})
export class unknownValuePipe implements PipeTransform {
    transform(value: string | null | undefined | number): string | number {
        if (value !== 0 && value == '' || !value) {
            return "<i>Não informado</i>";
        }
        return value;
    }
}
