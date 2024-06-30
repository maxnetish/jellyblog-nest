import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as PostRegActions from './post-reg.actions';
import * as PostRegSelectors from './post-reg.selectors';

@Injectable({
  providedIn: 'root',
})
export class PostRegFacade {
  constructor(
    private readonly store: Store,
  ) {
  }

  posts$ = this.store.select(PostRegSelectors.selectPosts);
  loadingStatus$ = this.store.select(PostRegSelectors.selectLoadingStatus);

  init() {
    this.store.dispatch(PostRegActions.init());
  }
}
