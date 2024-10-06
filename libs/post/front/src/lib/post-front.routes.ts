import { AppRoute } from '@jellyblog-nest/utils/front';
import { PostRegComponent } from './reg/reg.component';
import { provideState } from '@ngrx/store';
import * as PostRegReducer from './reg/store/post-reg.reducer';
import { provideEffects } from '@ngrx/effects';
import { PostRegEffects } from './reg/store/post-reg.effects';
import { PostEditComponent } from './post-edit/post-edit.component';

export const PostRoutes: AppRoute[] = [
  {
    path: '',
    redirectTo: 'reg',
    pathMatch: 'full',
  },
  {
    path: 'reg',
    component: PostRegComponent,
    providers: [
      provideState(
        PostRegReducer.POST_REG_FEATURE_KEY,
        PostRegReducer.reducer,
      ),
      provideEffects([
        PostRegEffects,
      ]),
    ],
  },
  {
    path: 'edit/:id',
    component: PostEditComponent,
  },
];
