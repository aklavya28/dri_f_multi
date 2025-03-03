import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeSpaces'
})
export class CapitalizeSpacesPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    // Regular expression to find positions where a space should be added
    return value.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
}

