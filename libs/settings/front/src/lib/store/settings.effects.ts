import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as SettingsActions from './settings.actions';
import { SettingsService } from '../settings.service';
import { GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs';
import { AuthFacade } from '@jellyblog-nest/auth/front';
import { UserRole } from '@jellyblog-nest/utils/common';


@Injectable()
export class SettingsEffects {


  loadSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SettingsActions.loadSettings, GlobalActions.loadApp),
      withLatestFrom(this.authFacade.userRole$),
      switchMap(([, userRole]) => {
        if (userRole === UserRole.ADMIN) {
          return this.settingsService.findPrivate();
        }
        return this.settingsService.findCommon();
      }),
      map((response) => {
        return SettingsActions.gotSettings({settings: response});
      }),
      catchError((err, caught) => {
        this.store.dispatch(SettingsActions.failSettings({err}));
        this.store.dispatch(
          GlobalActions.addGlobalToast({
            text: err.message,
            severity: GlobalToastSeverity.ERROR,
          }),
        );
        return caught;
      }),
    );
  });

  updateSetting$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SettingsActions.updateSetting),
      switchMap((action) => {
        const settingUpdateDto = {
          name: action.name,
          value: action.value,
        };
        return this.settingsService.update(settingUpdateDto).pipe(
          map(() => settingUpdateDto),
        );
      }),
      map((newSetting) => {
        return SettingsActions.successUpdateSetting(newSetting);
      }),
      catchError((err, caught) => {
        this.store.dispatch(SettingsActions.failUpdateSetting({err}));
        this.store.dispatch(
          GlobalActions.addGlobalToast({
            text: err.message,
            severity: GlobalToastSeverity.ERROR,
          }),
        );
        return caught;
      }),
    );
  });

  constructor(
    private actions$: Actions,
    private readonly settingsService: SettingsService,
    private readonly store: Store,
    private readonly authFacade: AuthFacade,
  ) {
  }

}
