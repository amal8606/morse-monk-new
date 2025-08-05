import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fallback',
  standalone: true, // ✅ Angular 18+ supports standalone pipes
})
export class FallbackPipe implements PipeTransform {
  transform(value: any, fallbackText: string = 'No Data'): any {
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      return fallbackText;
    }
    return value;
  }
}
