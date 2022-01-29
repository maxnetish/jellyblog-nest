import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as GlobalActions from './store/actions';
import { AppRoute } from './app-route';
import { GlobalToastSeverity } from './global-toast-severity';
import * as AppValidators from './validator';
import { ValidationMessageComponent } from './components/validation-message/validation-message.component';
import { ModalContentComponent } from './components/modal-content/modal-content.component';
import { NgIconsModule } from '@ng-icons/core';
import { HeroX } from '@ng-icons/heroicons';
import { S3FileUrlPipe, buildS3FileUrl } from './s3-file-url.pipe';
import {
  AppendResponseContentDispositionPipe,
  appendResponseContentDisposition,
} from './append-response-content-disposition.pipe';
import { ToStrictBooleanPipe } from './to-strict-boolean.pipe';

@NgModule({
  imports: [
    CommonModule,
    NgIconsModule.withIcons({
      HeroX,
    }),
  ],
  declarations: [
    ValidationMessageComponent,
    ModalContentComponent,
    S3FileUrlPipe,
    AppendResponseContentDispositionPipe,
    ToStrictBooleanPipe,
  ],
  exports: [
    ValidationMessageComponent,
    ModalContentComponent,
    S3FileUrlPipe,
    AppendResponseContentDispositionPipe,
    ToStrictBooleanPipe,
  ],
})
export class UtilsFrontModule {
}

export {
  GlobalActions,
  AppRoute,
  GlobalToastSeverity,
  AppValidators,
  ValidationMessageComponent,
  S3FileUrlPipe,
  buildS3FileUrl,
  AppendResponseContentDispositionPipe,
  appendResponseContentDisposition,
  ToStrictBooleanPipe,
};
