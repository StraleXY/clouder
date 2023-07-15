import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateFormater' })
export class DateFormaterPipe implements PipeTransform {

    transform(value: string): string {
        const date = new Date(value);
    
        const formatter = new Intl.DateTimeFormat('en-UK', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
    
        const formattedDate = formatter.format(date);
    
        return formattedDate;
    }
}
