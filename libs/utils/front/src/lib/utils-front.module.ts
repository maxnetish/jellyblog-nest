import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as GlobalActions from './store/actions';
import { AppRoute } from './app-route';
import { GlobalToastSeverity } from './global-toast-severity';
import * as AppValidators from './validator';
import { ValidationMessageComponent } from './components/validation-message/validation-message.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ValidationMessageComponent,
  ],
  exports: [
    ValidationMessageComponent,
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
};
