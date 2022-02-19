import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { SettingsFacade } from '@jellyblog-nest/settings/front';
import { SettingName } from '@jellyblog-nest/utils/common';
import { Observable, tap } from 'rxjs';
import { FilestorelistFacade } from '../store/filestore-list.facade';
import { UploadEvents } from '@jellyblog-nest/utils/front-file-uploader';
import { GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';
import { Store } from '@ngrx/store';
import * as fromFilelistActions from '../store/filestore-list.actions';

export interface UploadFormState {
  prefix: string;
  revealOriginalFileName: boolean;
}

const initialState: UploadFormState = {
  prefix: '',
  revealOriginalFileName: false,
};

@Injectable()
export class UploadFormStore extends ComponentStore<UploadFormState> {
  constructor(
    private readonly settingsFacade: SettingsFacade,
    private readonly filelistFacade: FilestorelistFacade,
    private readonly globalStore: Store,
  ) {
    super(initialState);

    // Когда в списке меняют "директорию" - установить такую же здесь
    // setTimeout чтобы updater дергался после инициализации.
    setTimeout(() => {
      this.setPrefix(
        this.filelistFacade.prefix$,
      );
    });
  }

  readonly s3Bucket$: Observable<string | null | undefined> = this.settingsFacade.getSetting$(SettingName.S3_BUCKET);
  readonly s3Config$ = this.settingsFacade.s3ClientConfig$;
  readonly prefix$ = this.select(state => state.prefix);
  readonly revealOriginalFileName$ = this.select(state => state.revealOriginalFileName);

  readonly setPrefix = this.updater((state, prefix: string) => {
    return {
      ...state,
      prefix,
    };
  });

  readonly setRevealOriginalFileName = this.updater((state, revealOriginalFileName: boolean) => {
    return {
      ...state,
      revealOriginalFileName,
    };
  });

  readonly handleUploadEvents = this.effect((event$: Observable<UploadEvents.UploadEvent>) => {
    return event$.pipe(
      tap((event) => {
        switch (event.type) {
          case 'UploadBegin': {
            this.globalStore.dispatch(GlobalActions.addGlobalToast({
              text: `${event.fileInfo.name} uploading`,
              severity: GlobalToastSeverity.INFO,
            }));
            break;
          }
          case 'UploadError': {
            this.globalStore.dispatch(GlobalActions.addGlobalToast({
              text: event.errorInfo.message,
              severity: GlobalToastSeverity.ERROR,
            }));
            break;
          }
          case 'UploadSuccess': {
            this.globalStore.dispatch(GlobalActions.addGlobalToast({
              text: `${event.fileInfo.name} uploaded`,
              severity: GlobalToastSeverity.SUCCESS,
            }));
            // TODO notify filelist store after upload all pending files
            break;
          }
          case 'UploadItemAdded': {
            this.globalStore.dispatch(GlobalActions.addGlobalToast({
              text: `${event.file.name} added. ${event.pendingFilesCount} items wait for upload`,
              severity: GlobalToastSeverity.INFO,
            }));
            break;
          }
          case 'UploadQueueExhaust': {
            this.globalStore.dispatch(GlobalActions.addGlobalToast({
              text: 'Uploading queue empty',
              severity: GlobalToastSeverity.INFO,
            }));
            this.globalStore.dispatch(fromFilelistActions.beginBrowse());
          }
        }
      }),
    );
  });
}

