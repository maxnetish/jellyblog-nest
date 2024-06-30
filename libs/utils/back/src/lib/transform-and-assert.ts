import { validate } from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidatorOptions } from 'class-validator/types/validation/ValidatorOptions';
import { ClassConstructor, ClassTransformOptions } from 'class-transformer/types/interfaces';
import { plainToInstance } from 'class-transformer';

/**
 * Transform plain object to instance of cls.
 * Throws http exception if ClassValidator validation  fails.
 */
export async function transformAndAssert<TargetType extends object, PlainType>({cls, plain, transformOptions, validatorOptions}: {
  cls: ClassConstructor<TargetType>,
  plain: PlainType[] | PlainType,
  transformOptions?: ClassTransformOptions,
  validatorOptions?: ValidatorOptions,
}) {
  const transformed = plainToInstance(cls, plain, transformOptions);
  const validationResults = await validate(transformed, validatorOptions);
  if (validationResults?.length) {
    throw new HttpException(
      validationResults
        .map(item => Object.values(item.constraints).join('; '))
        .join('; '),
      HttpStatus.BAD_REQUEST,
    );
  }
  return transformed;
}
