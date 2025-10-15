import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyField',
  standalone: false
})
export class EmptyFieldPipe implements PipeTransform {
  transform(value: any, placeholder: string = '—'): string {
    if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      return placeholder;
    }
    return value;
  }
}