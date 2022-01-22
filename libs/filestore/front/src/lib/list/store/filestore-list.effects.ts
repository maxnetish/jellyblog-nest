import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap, tap, withLatestFrom, take } from 'rxjs/operators';
import * as fromFilestroreListActions from './filestore-list.actions';
import { Store } from '@ngrx/store';
import * as fromFilestoreListSelectors from './filestore-list.selectors';
import { SettingName } from '@jellyblog-nest/utils/common';
import { SettingsFacade } from '@jellyblog-nest/settings/front';
import { ListObjectsCommand, S3Client } from '@aws-sdk/client-s3';
import { catchError, combineLatest, from } from 'rxjs';
import { GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';

@Injectable()
export class FilestoreListEffects {

  initFilestoreLists$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromFilestroreListActions.beginBrowseAtPrefix,
      ),
      switchMap(() => {
        return combineLatest([
          this.store.select(fromFilestoreListSelectors.selectLoadingStatus),
          this.store.select(fromFilestoreListSelectors.selectDelimiter),
          this.store.select(fromFilestoreListSelectors.selectPrefix),
          this.settingsFacade.s3ClientConfig$,
          this.settingsFacade.getSetting$(SettingName.S3_BUCKET),
        ]).pipe(
          take(1),
        );
      }),
      switchMap(([, delimiter, prefix, s3ClientConfig, s3Bucket]) => {
        const s3Client = new S3Client(s3ClientConfig);
        const command = new ListObjectsCommand({
          Bucket: s3Bucket || undefined,
          Delimiter: delimiter,
          Prefix: prefix,
        });
        return from(s3Client.send(command)).pipe(
          map((response) => {
            return {
              response,
              s3Client,
            };
          }),
        );
      }),
      tap(({ s3Client }) => {
        s3Client.destroy();
      }),
      map(({ response }) => {
        return fromFilestroreListActions.gotListObjectsCommandOutput({ response });
      }),
      catchError((err, caught) => {
        this.store.dispatch(fromFilestroreListActions.failListObjectsCommandOutput({ err }));
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
    private readonly store: Store,
    private readonly settingsFacade: SettingsFacade,
  ) {
  }

}
