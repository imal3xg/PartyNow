import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string | Date, ...args: unknown[]): string {
    if (!value) {
      return '';
    }

    // Convertimos el valor a un objeto Date si es un string
    const date = typeof value === 'string' ? new Date(value) : value;

    // Opciones para formatear la fecha
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'numeric',
      year: 'numeric',
    };

    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }
}
