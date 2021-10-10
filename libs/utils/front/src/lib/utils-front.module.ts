import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as GlobalActions from './store/actions';
import { AppRoute } from './app-route';

@NgModule({
  imports: [CommonModule],
})
export class UtilsFrontModule {
}

export {
  GlobalActions,
  AppRoute,
};
