import { Module } from '@nestjs/common';
import { ToArrayPipe } from './to-array.pipe';
import { settingsDefault } from './settings-default';
import { ToDatePipe } from './to-date.pipe';
import { transformAndAssert } from './transform-and-assert';

@Module({
  controllers: [],
  providers: [
    ToArrayPipe,
    ToDatePipe,
  ],
  exports: [
    ToArrayPipe,
    ToDatePipe,
  ],
})
export class UtilsBackModule {
}

export {
  ToArrayPipe,
  settingsDefault,
  ToDatePipe,
  transformAndAssert,
}
