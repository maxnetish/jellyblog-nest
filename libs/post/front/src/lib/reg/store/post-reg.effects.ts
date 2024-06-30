import { Injectable } from '@angular/core';
import { PostService } from '../../post.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PostRegActions from './post-reg.actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import * as PostRegSelectors from './post-reg.selectors';
import { GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';

@Injectable()
export class PostRegEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly postService: PostService,
  ) {
  }

  fetchPosts$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(PostRegActions.init),
        withLatestFrom(
          this.store.select(PostRegSelectors.selectCriteria),
        ),
        switchMap(([action, criteria]) => {
          return this.postService.findPosts({request: criteria});
        }),
        map((findResponse) => {
          return PostRegActions.gotPage({page: findResponse});
        }),
        catchError((error, caught) => {
          this.store.dispatch(GlobalActions.addGlobalToast({
            severity: GlobalToastSeverity.ERROR,
            text: error.message || 'Fail',
          }));
          this.store.dispatch(PostRegActions.failPage({error}));
          return caught;
        }),
      )
  })
}
