/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 23/03/2025
 **/

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'datetimeFormat',
    standalone: true
})
export class DatetimeFormatPipe implements PipeTransform {
    transform(value: string | null): string {
        if (!value) {
            return 'Não informado';
        }
        const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        if (dateTimeRegex.test(value)) {
            const [datePart, timePart] = value.split(' ');
            const [year, month, day] = datePart.split('-');
            return `${day}/${month}/${year} - ${timePart}`;
        }
        return value;
    }
}
