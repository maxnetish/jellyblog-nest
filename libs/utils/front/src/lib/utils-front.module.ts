import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as GlobalActions from './store/actions';

@NgModule({
  imports: [CommonModule],
})
export class UtilsFrontModule {
}

export {
  GlobalActions,
};
