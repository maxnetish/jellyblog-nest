import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, take } from 'rxjs/operators';
import * as fromFilestroreListActions from './filestore-list.actions';
import { Store } from '@ngrx/store';
import * as fromFilestoreListSelectors from './filestore-list.selectors';
import { SettingName } from '@jellyblog-nest/utils/common';
import { SettingsFacade } from '@jellyblog-nest/settings/front';
import { ListObjectsCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { catchError, combineLatest, from } from 'rxjs';
import { GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';

@Injectable()
export class FilestoreListEffects {

  beginBrowseFolder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromFilestroreListActions.beginBrowse,
      ),
      switchMap(() => {
        return combineLatest([
          this.store.select(fromFilestoreListSelectors.selectPrefix),
          this.store.select(fromFilestoreListSelectors.selectDelimiter),
          this.settingsFacade.s3ClientConfig$,
          this.settingsFacade.getSetting$(SettingName.S3_BUCKET),
        ]).pipe(
          take(1),
        );
      }),
      switchMap(this.fetchObjects.bind(this)),
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

  changeFolder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromFilestroreListActions.changeFolder,
      ),
      switchMap((action) => {
        return combineLatest([
          this.store.select(fromFilestoreListSelectors.selectDelimiter),
          this.settingsFacade.s3ClientConfig$,
          this.settingsFacade.getSetting$(SettingName.S3_BUCKET),
        ]).pipe(
          take(1),
          map(([delimiter, s3ClientConfig, s3Bucket]) => {
            return [
              action.prefix,
              delimiter,
              s3ClientConfig,
              s3Bucket,
            ] as [string, string, S3ClientConfig, string | null | undefined];
          }),
        );
      }),
      switchMap(this.fetchObjects.bind(this)),
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

  // Переиспользуем S3Client, хотя никакого профита от этого наверно нет.
  private _s3Client: S3Client | null = null;
  private _s3ActualConfig: S3ClientConfig | null = null;

  private getS3Client(s3ClientConfig: S3ClientConfig) {
    if (
      this._s3Client &&
      this._s3ActualConfig &&
      this._s3ActualConfig.endpoint === s3ClientConfig.endpoint &&
      this._s3ActualConfig.credentials &&
      typeof this._s3ActualConfig.credentials !== 'function' &&
      s3ClientConfig.credentials &&
      typeof s3ClientConfig.credentials !== 'function' &&
      this._s3ActualConfig.credentials.accessKeyId === s3ClientConfig.credentials.accessKeyId &&
      this._s3ActualConfig.credentials.secretAccessKey === s3ClientConfig.credentials.secretAccessKey &&
      this._s3ActualConfig.region === s3ClientConfig.region
    ) {
      return this._s3Client;
    }
    if (this._s3Client) {
      this._s3Client.destroy();
    }
    this._s3Client = new S3Client(s3ClientConfig);
    this._s3ActualConfig = {
      ...s3ClientConfig,
    };
    return this._s3Client;
  }

  constructor(
    private actions$: Actions,
    private readonly store: Store,
    private readonly settingsFacade: SettingsFacade,
  ) {
  }

  private fetchObjects(
    [prefix, delimiter, s3ClientConfig, s3Bucket]
      : [string, string, S3ClientConfig, string | null | undefined],
  ) {
    const s3Client = this.getS3Client(s3ClientConfig);
    const command = new ListObjectsCommand({
      Bucket: s3Bucket || undefined,
      Delimiter: delimiter,
      Prefix: prefix,
    });
    return from(s3Client.send(command)).pipe(
      map((response) => {
        return {
          response,
        };
      }),
    );
  }

}
