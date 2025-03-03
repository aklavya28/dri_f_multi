import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {
  constructor(private el: ElementRef) {}

  // @HostListener('input', ['$event']) onInputChange(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   input.value = input.value.toUpperCase();
  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const uppercasedValue = input.value.toUpperCase();

    if (input.value !== uppercasedValue) {
      input.value = uppercasedValue;
      input.setSelectionRange(start, end);
      input.dispatchEvent(new Event('input')); // Trigger input event to ensure Angular's change detection picks it up
    }
  }

}
