import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { NxModule } from '@nx/angular';
import { Observable } from 'rxjs';

import * as AuthActions from './auth.actions';
import { AuthEffects } from './auth.effects';
import { hot } from 'jasmine-marbles';

describe('AuthEffects', () => {
  let actions: Observable<Action>;
  let effects: AuthEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        AuthEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(AuthEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: AuthActions.gotUserInfo });

      const expected = hot('-a-|', {
        a: AuthActions.gotUserInfo({ user: null }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
