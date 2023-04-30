import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap, take } from 'rxjs/operators';
import * as fromFilestroreListActions from './filestore-list.actions';
import { Store } from '@ngrx/store';
import * as fromFilestoreListSelectors from './filestore-list.selectors';
import { SettingName } from '@jellyblog-nest/utils/common';
import { SettingsFacade } from '@jellyblog-nest/settings/front';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { catchError, combineLatest, from, Observable, takeUntil, tap, withLatestFrom } from 'rxjs';
import { ConfirmModalService, GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';

@Injectable()
export class FilestoreListEffects {

  beginBrowseFolder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromFilestroreListActions.beginBrowse,
        // refetch Objects after rename.
        // Because we don't know, how changed prefixes
        fromFilestroreListActions.renameObjectSuccess,
      ),
      switchMap(() => {
        return combineLatest([
          this.store.select(fromFilestoreListSelectors.selectPrefix),
          this.store.select(fromFilestoreListSelectors.selectDelimiter),
          this.settingsFacade.s3ClientConfig$,
          this.settingsFacade.getSetting$(SettingName.S3_BUCKET),
        ]).pipe(
          take(1),
          map(([prefix, delimiter, s3ClientConfig, s3Bucket]) => {
            // FIXME если разлогинится и залогиниться, здесь будет неполный s3 конфиг,
            //  без кредов. Т.к. настройки приезжают после того как перешли на эту страницу.
            return {
              prefix,
              delimiter,
              s3ClientConfig,
              s3Bucket,
              nextMarker: null,
            };
          }),
        );
      }),
      switchMap(this.fetchObjects.bind(this)),
      map(({response}) => {
        return fromFilestroreListActions.gotListObjectsCommandOutput({response});
      }),
      catchError((err, caught) => {
        return this.onCatchError(err, caught);
      }),
    );
  });

  /**
   * Если предыдущий запрос списка имеет IsTruncated: true -
   * это значит, что не все объекты еще получили. Посылаем запрос за следующей порцией,
   * используя маркер из предыдущего запроса.
   */
  continueBrowseFolder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromFilestroreListActions.gotListObjectsCommandOutput,
        fromFilestroreListActions.gotNextListObjectsCommandOutput,
      ),
      filter((action) => {
        return !!action.response.IsTruncated;
      }),
      switchMap((action) => {
        return combineLatest([
          this.settingsFacade.s3ClientConfig$,
          this.settingsFacade.getSetting$(SettingName.S3_BUCKET),
        ]).pipe(
          take(1),
          map(([s3ClientConfig, s3Bucket]) => {
            return {
              action,
              s3ClientConfig,
              s3Bucket,
            };
          }),
        );
      }),
      switchMap(({action, s3ClientConfig, s3Bucket}) => {
        const previousResponse = action.response;
        return this.fetchObjects({
          prefix: previousResponse.Prefix || '',
          delimiter: previousResponse.Delimiter || '',
          nextMarker: previousResponse.NextMarker,
          s3Bucket,
          s3ClientConfig,
        });
      }),
      map(({response}) => {
        return fromFilestroreListActions.gotNextListObjectsCommandOutput({response});
      }),
      catchError((err, caught) => {
        return this.onCatchError(err, caught);
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
            return {
              prefix: action.prefix,
              delimiter,
              s3ClientConfig,
              s3Bucket,
              nextMarker: null,
            };
          }),
        );
      }),
      switchMap(this.fetchObjects.bind(this)),
      map(({response}) => {
        return fromFilestroreListActions.gotListObjectsCommandOutput({response});
      }),
      catchError((err, caught) => {
        return this.onCatchError(err, caught);
      }),
    );
  });

  deleteObject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromFilestroreListActions.deleteObject),
      switchMap((action) => {
        return this.confirmModalService.show({
          title: 'Удаление',
          message: `Удалить файл ${action.key} из хранилища?`,
        }).pipe(
          map((confirm) => {
            return {
              confirm,
              key: action.key,
            };
          }),
        );
      }),
      filter(({confirm}) => confirm),
      withLatestFrom(
        this.settingsFacade.s3ClientConfig$,
        this.settingsFacade.getSetting$(SettingName.S3_BUCKET),
      ),
      switchMap(([{key}, s3ClientConfig, s3Bucket]) => {
        const command = new DeleteObjectCommand({
          Bucket: s3Bucket || undefined,
          Key: key,
        });
        const client = this.getS3Client(s3ClientConfig);
        return from(client.send(command)).pipe(
          map((response) => {
            return {
              response,
              key,
            };
          }),
        );
      }),
      map(({key}) => {
        return fromFilestroreListActions.deleteObjectSuccess({key});
      }),
      catchError((err, caught) => {
        this.store.dispatch(fromFilestroreListActions.deleteObjectFail({err}));
        return this.onCatchError(err, caught);
      }),
    );
  });

  deleteObjectSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromFilestroreListActions.deleteObjectSuccess),
      tap((action) => {
        this.store.dispatch(
          GlobalActions.addGlobalToast({
            text: `${action.key} deleted`,
            severity: GlobalToastSeverity.SUCCESS,
          }),
        );
      }),
    );
  }, {
    dispatch: false,
  });

  renameObject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromFilestroreListActions.renameObject),
      switchMap((action) => {
        return this.confirmModalService.show({
          title: 'Переименование',
          message: `Переименовать файл ${action.currentKey} в ${action.newKey}? У файла изменится его постоянный URL.`,
        }).pipe(
          map((confirm) => {
            return {
              confirm,
              currentKey: action.currentKey,
              newKey: action.newKey,
            };
          }),
        );
      }),
      filter(({confirm}) => confirm),
      withLatestFrom(
        this.settingsFacade.s3ClientConfig$,
        this.settingsFacade.getSetting$(SettingName.S3_BUCKET),
      ),
      switchMap(([{currentKey, newKey}, s3ClientConfig, s3Bucket])=> {
        const command = new CopyObjectCommand({
          Bucket: s3Bucket || undefined,
          Key: newKey,
          // encode required because parameter passed in header
          CopySource:  encodeURI(`${s3Bucket}/${currentKey}`),
        });
        const client = this.getS3Client(s3ClientConfig);
        return from(client.send(command)).pipe(
          map((copyResponse) => {
            return {
              copyResponse,
              currentKey,
              newKey,
              s3ClientConfig,
              s3Bucket,
            };
          }),
        );
      }),
      switchMap(({copyResponse, currentKey, newKey, s3ClientConfig, s3Bucket}) => {
        const command = new DeleteObjectCommand({
          Bucket: s3Bucket || undefined,
          Key: currentKey,
        });
        const client = this.getS3Client(s3ClientConfig);
        return from(client.send(command)).pipe(
          map((deleteResponse) => {
            return {
              currentKey,
              newKey,
              output: copyResponse,
            };
          }),
        );
      }),
      map(({currentKey, newKey, output})=> {
        return fromFilestroreListActions.renameObjectSuccess({
          currentKey,
          newKey,
          output,
        });
      }),
      catchError((err, caught) => {
        this.store.dispatch(fromFilestroreListActions.renameObjectFail({err}));
        return this.onCatchError(err, caught);
      }),
    );
  });

  renameObjectSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromFilestroreListActions.renameObjectSuccess),
      tap((action) => {
        this.store.dispatch(
          GlobalActions.addGlobalToast({
            text: `${action.currentKey} now become ${action.newKey}`,
            severity: GlobalToastSeverity.SUCCESS,
          }),
        );
      }),
    );
  }, {
    dispatch: false,
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
    private readonly confirmModalService: ConfirmModalService,
  ) {
  }

  private fetchObjects(
    {prefix, delimiter, s3ClientConfig, s3Bucket, nextMarker}
      : { prefix: string, delimiter: string, s3ClientConfig: S3ClientConfig, s3Bucket: string | null | undefined, nextMarker?: string | null },
  ) {
    const s3Client = this.getS3Client(s3ClientConfig);
    const command = new ListObjectsCommand({
      Bucket: s3Bucket || undefined,
      Delimiter: delimiter,
      Prefix: prefix,
      Marker: nextMarker || undefined,
    });
    return from(s3Client.send(command)).pipe(
      map((response) => {
        return {
          response,
        };
      }),
    );
  }

  private onCatchError<D>(err: any, caught: Observable<D>) {
    this.store.dispatch(fromFilestroreListActions.failListObjectsCommandOutput({err}));
    this.store.dispatch(
      GlobalActions.addGlobalToast({
        text: err.message,
        severity: GlobalToastSeverity.ERROR,
      }),
    );
    return caught;
  }
}
