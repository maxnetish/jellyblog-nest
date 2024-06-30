import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './routes';
import { StoreModule } from '@ngrx/store';
import * as PostRegReducer from './reg/store/post-reg.reducer';
import { EffectsModule } from '@ngrx/effects';
import { PostRegEffects } from './reg/store/post-reg.effects';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(
      PostRegReducer.POST_REG_FEATURE_KEY,
      PostRegReducer.reducer,
    ),
    EffectsModule.forFeature([
      PostRegEffects,
    ]),
  ]
})
export class PostFrontModule {

}
