import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
export class CustomValidation {

    static valueSelected(myArray: any[]): ValidatorFn {
      return (c: AbstractControl): { [key: string]: boolean } | null => {
        let selectboxValue = c.value;
        let pickedOrNot = myArray.filter(
          (alias) => alias.name === selectboxValue
        );

        if (pickedOrNot.length > 0) {
          // everything's fine. return no error. therefore it's null.
          return null;
        } else {
          //there's no matching selectboxvalue selected. so return match error.
          return { match: true };
        }
      };
    }

    static pan(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
          const valid = panRegex.test(control.value);
          return valid ? null : { invalidPan: true };
        };
      }

      static only_digit(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          // const panRegex = /^-?(0|[1-9]\d*)?$/;
          const panRegex = /^([1-9]\d*|0\.\d*[1-9]\d*|[1-9]\d*\.\d+)$/;
          const valid = panRegex.test(control.value);
          return valid ? null : { invalidDigit: true };
        };
      }
      static only_digit_with_zero(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          // const panRegex = /^-?(0|[1-9]\d*)?$/;
          const panRegex = /^([0-9]\d*|0\.\d*[0-9]\d*|[0-9]\d*\.\d+)$/;
          const valid = panRegex.test(control.value);
          return valid ? null : { invalidDigit: true };
        };
      }
      static only_digit_without_decimal(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const panRegex = /^[1-9]\d*$/;

          const valid = panRegex.test(control.value);
          return valid ? null : { invalidDigitD: true };
        };
      }

      static alphabets(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const panRegex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/;
          const valid = panRegex.test(control.value);
          return valid ? null : { alphabets: true };
        };
      }
      static alphanumeric(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const panRegex = /^[a-zA-Z0-9 ]*$/;
          const valid = panRegex.test(control.value);
          return valid ? null : { alphanumeric: true };
        };
      }
      static alphanumeric_without_space(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const panRegex = /^[a-zA-Z0-9]*$/;
          const valid = panRegex.test(control.value);
          return valid ? null : { alphanumeric: true };
        };
      }
      // follow this
      // date: ['', [Validators.required, CustomValidation.dateNotGreaterThanToday.bind(this)]],
      static  dateNotGreaterThanToday(control: FormControl)  {
        let today = new Date();
        const selectedDate = new Date(control.value);
        return selectedDate <= today ? null : { dateGreaterThanToday: true };
      }


      static dateRangeValidator(startDateKey: string, endDateKey: string): ValidatorFn {
        return (formGroup: AbstractControl): ValidationErrors | null => {
          const startDate = formGroup.get(startDateKey)?.value;
          const endDate = formGroup.get(endDateKey)?.value;

          if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            return { dateRangeInvalid: true }; // Return an error if the dates are invalid
          }
          return null; // Return null if no error
        };
      }
  }
