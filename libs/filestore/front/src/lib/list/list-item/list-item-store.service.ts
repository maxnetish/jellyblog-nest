import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { LoadingStatus, SettingName } from '@jellyblog-nest/utils/common';
import { from, switchMap, tap, withLatestFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HeadObjectCommand, HeadObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { SettingsFacade } from '@jellyblog-nest/settings/front';
import { FileInfo } from '../store/file-info';

export interface ListItemState {
  shortFileInfo: FileInfo | null;
  expanded: boolean;
  detailsLoadingStatus: LoadingStatus;
  details: HeadObjectCommandOutput | null;
};

const initialState: ListItemState = {
  shortFileInfo: null,
  expanded: false,
  detailsLoadingStatus: LoadingStatus.INITIAL,
  details: null,
};

@Injectable()
export class FilestoreListItemStore extends ComponentStore<ListItemState> {
  constructor(
    private readonly settingsFacade: SettingsFacade,
  ) {
    super(initialState);
  }

  readonly expanded$ = this.select(
    state => state.expanded,
  );

  readonly collapsed$ = this.select(
    state => !state.expanded,
  );

  readonly shortFileInfo$ = this.select(
    state => state.shortFileInfo,
  );

  readonly detailsLoadingStatus$ = this.select(
    state => state.detailsLoadingStatus,
  );

  readonly fetchDetails = this.effect((fetch$) => {
    return fetch$.pipe(
      withLatestFrom(
        this.shortFileInfo$,
        this.detailsLoadingStatus$,
        this.settingsFacade.getSetting$(SettingName.S3_BUCKET),
        this.settingsFacade.s3ClientConfig$,
      ),
      filter(([, shortFileInfo, loadingStatus]) => {
        return !!shortFileInfo && loadingStatus === LoadingStatus.INITIAL;
      }),
      tap(() => {
        this.patchState({
          detailsLoadingStatus: LoadingStatus.LOADING,
        });
      }),
      switchMap(([, shortFileInfo, , bucket, s3ClientConfig]) => {
        const command = new HeadObjectCommand({
          Bucket: bucket || undefined,
          Key: shortFileInfo?.Key || '',
        });
        const client = new S3Client(s3ClientConfig);
        return from(client.send(command)).pipe(
          tapResponse(
            (response) => {
              console.log('GOT ', response);
              this.patchState({
                details: {...response},
                detailsLoadingStatus: LoadingStatus.SUCCESS,
              });
            },
            () => {
              this.patchState({
                detailsLoadingStatus: LoadingStatus.FAILED,
              });
            }),
        );
      }),
    );
  });

  readonly setFileInfo = this.updater((state, fileInfo: FileInfo) => {
    return {
      ...state,
      shortFileInfo: fileInfo,
      detailsLoadingStatus: LoadingStatus.INITIAL,
    };
  });

  readonly toggleExpanded = this.updater((state) => {
    if (!state.expanded) {
      this.fetchDetails();
    }
    return {
      ...state,
      expanded: !state.expanded,
    };
  });

}
