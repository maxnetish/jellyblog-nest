import { Module } from '@nestjs/common';
import { ToArrayPipe } from './to-array.pipe';
import { settingsDefault } from './settings-default';

@Module({
  controllers: [],
  providers: [
    ToArrayPipe,
  ],
  exports: [
    ToArrayPipe,
  ],
})
export class UtilsBackModule {
}

export {
  ToArrayPipe,
  settingsDefault,
}
