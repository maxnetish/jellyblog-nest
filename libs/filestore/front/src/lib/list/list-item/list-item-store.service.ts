import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { LoadingStatus, SettingName } from '@jellyblog-nest/utils/common';
import { from, Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { HeadObjectCommand, HeadObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { SettingsFacade } from '@jellyblog-nest/settings/front';
import { FileInfo } from '../store/file-info';
import { GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';
import { Store } from '@ngrx/store';

export interface ListItemState {
  shortFileInfo: FileInfo | null;
  expanded: boolean;
  detailsLoadingStatus: LoadingStatus;
  details: HeadObjectCommandOutput | null;
  renameActive: boolean;
};

export interface FileMetadataItem {
  name: string;
  value: string;
}

const initialState: ListItemState = {
  shortFileInfo: null,
  expanded: false,
  detailsLoadingStatus: LoadingStatus.INITIAL,
  details: null,
  renameActive: false,
};

@Injectable()
export class FilestoreListItemStore extends ComponentStore<ListItemState> {
  constructor(
    private readonly settingsFacade: SettingsFacade,
    private readonly globalStore: Store,
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

  readonly detailsContentType$ = this.select(
    (state) => {
      if (state.details) {
        return state.details.ContentType;
      }
      return null;
    },
  );

  readonly contentTypeImage$ = this.select(
    (state) => {
      if (state.details && state.details.ContentType) {
        return state.details.ContentType.startsWith('image');
      }
      return false;
    },
  );

  readonly detailsMetadata$: Observable<FileMetadataItem[]> = this.select(
    (state) => {
      if (state.details && state.details.Metadata) {
        return Object.entries(state.details.Metadata).map(([name, value]) => {
          return {
            name,
            value: decodeURI(value),
          };
        });
      }
      return [];
    },
  );

  readonly fileKey$ = this.select(
    (state) => {
      if (state.shortFileInfo) {
        return state.shortFileInfo.Key || '';
      }
      return '';
    },
  );

  readonly fileDownloadName$ = this.select(
    (state) => {
      if (state.details && state.details.Metadata && state.details.Metadata['originalname']) {
        return state.details.Metadata['originalname'];
      }
      return '';
    },
  )

  readonly s3PublicEndpoint$: Observable<string> = this.settingsFacade.getSetting$(SettingName.S3_PUBLIC_ENDPOINT).pipe(
    map(s3PublicEndPointOrEmpty => s3PublicEndPointOrEmpty || ''),
  );

  readonly renameActive$ = this.select(
    (state) => state.renameActive,
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
              this.patchState({
                details: {...response},
                detailsLoadingStatus: LoadingStatus.SUCCESS,
              });
            },
            (err) => {
              this.globalStore.dispatch(GlobalActions.addGlobalToast({
                text: `Fetch details failed: ${err}`,
                severity: GlobalToastSeverity.ERROR,
              }));
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

  readonly renameToggle = this.updater((state) => {
    return {
      ...state,
      renameActive: !state.renameActive,
    };
  });

}
