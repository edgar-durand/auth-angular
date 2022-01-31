import { FormGroup } from '@angular/forms';

export class PasswordValidator {
  // If our validation fails, we return an object with a key for the error name and a value of true.
  // Otherwise, if the validation passes, we simply return null because there is no error.

  static areNotEqual(formGroup: FormGroup): void {
    if (
      formGroup.controls.password.value ===
      formGroup.controls.confirm_password.value
    ) {
      return formGroup.controls.confirm_password.setErrors(null);
    }
    return formGroup.controls.confirm_password.setErrors({ areNotEqual: true });
  }
}
