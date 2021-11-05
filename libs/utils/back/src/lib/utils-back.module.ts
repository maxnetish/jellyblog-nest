import { Module } from '@nestjs/common';
import { ToArrayPipe } from './to-array.pipe';

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
}
