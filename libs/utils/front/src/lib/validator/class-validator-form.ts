import {
  FormArray, FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ClassConstructor, ClassTransformOptions, plainToClass } from 'class-transformer';
import { validateSync, ValidationError, ValidatorOptions } from 'class-validator';

function validationConstraintsToValidationErrors(constraints: ValidationError['constraints']): ValidationErrors | null{
  if(constraints) {
    return Object.entries(constraints).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: value,
      };
    }, {});
  }
  return null;
}

export function classValidatorToSyncValidator<T extends Record<string, any>>(
  classType: ClassConstructor<T>,
  validatorOptions?: ValidatorOptions,
  transformOptions?: ClassTransformOptions,
): ValidatorFn {
  return (control) => {
    const instance = plainToClass(classType, control.value, transformOptions);
    const validationResults = validateSync(instance, validatorOptions);

    if(control instanceof FormGroup || control instanceof FormArray) {
      Object.entries(control.controls).forEach(([key, childControl])=>{
        const validationResultForControl = validationResults.find(vr => vr.property === key);
        if(validationResultForControl) {
          childControl.setErrors(validationConstraintsToValidationErrors(validationResultForControl.constraints));
        } else {
          childControl.setErrors(null);
        }
      })
    }

    return null;
  };
}
