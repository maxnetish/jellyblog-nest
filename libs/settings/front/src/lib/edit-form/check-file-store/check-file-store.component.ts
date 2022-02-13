import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { HeadObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { SettingsFacade } from './../../store/settings.facade';
import {
  FileInfo,
  UploadBeginEvent,
  UploadErrorEvent,
  UploadSuccessEvent,
} from '@jellyblog-nest/utils/front-file-uploader';
import { GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';
import { Store } from '@ngrx/store';
import { SettingName } from '@jellyblog-nest/utils/common';
import { create } from 'content-disposition-header';

@Component({
  selector: 'app-settings-check-file-store',
  templateUrl: './check-file-store.component.html',
  styleUrls: ['./check-file-store.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckFileStoreComponent implements OnInit {

  s3Config$: Observable<S3ClientConfig>;
  s3Bucket$: Observable<string | null | undefined>;
  s3Region$: Observable<string | null | undefined>;
  s3PublicEndpoint$: Observable<string | null | undefined>;
  testUploadResult: FileInfo[] = [];

  private async getFileInfoFromStorage(fileId: string) {
    this.store.dispatch(GlobalActions.addGlobalToast({
      text: `Fetch file info of ${fileId} from storarge`,
      severity: GlobalToastSeverity.INFO,
    }));

    try {
      const s3Config = await firstValueFrom(this.s3Config$);
      const s3Bucket = await firstValueFrom(this.s3Bucket$);

      const client = new S3Client({
        ...s3Config,
      });

      const command = new HeadObjectCommand({
        Bucket: s3Bucket || undefined,
        Key: fileId,
      });

      const result = await client.send(command);

      this.store.dispatch(GlobalActions.addGlobalToast({
        text: 'Got file info from storarge',
        severity: GlobalToastSeverity.SUCCESS,
      }));
      return result;
    } catch (err: any) {
      this.store.dispatch(GlobalActions.addGlobalToast({
        text: err.message,
        severity: GlobalToastSeverity.ERROR,
      }));
      return null;
    }

  }

  private async addFileInfo(fileId: string) {
    const response = await this.getFileInfoFromStorage(fileId);
    if (response) {
      const fileInfo = FileInfo.fromHeadObjectCommandOutput(response, fileId);
      this.testUploadResult.push(fileInfo);
      this.changeDetectorRef.markForCheck();
    }
  }

  constructor(
    public readonly settingsFacade: SettingsFacade,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly store: Store,
  ) {
    this.s3Config$ = this.settingsFacade.s3ClientConfig$;
    this.s3Bucket$ = this.settingsFacade.getSetting$(SettingName.S3_BUCKET);
    this.s3Region$ = this.settingsFacade.getSetting$(SettingName.S3_REGION);
    this.s3PublicEndpoint$ = this.settingsFacade.getSetting$(SettingName.S3_PUBLIC_ENDPOINT);
  }

  ngOnInit(): void {
  }

  handleTestUploadEvents($event: UploadBeginEvent | UploadSuccessEvent | UploadErrorEvent) {
    console.log('Upload: ', $event);
    switch ($event.type) {
      case 'UploadBegin': {
        this.store.dispatch(GlobalActions.addGlobalToast({
          text: `${$event.fileInfo.name} uploading`,
          severity: GlobalToastSeverity.INFO,
        }));
        break;
      }
      case 'UploadError': {
        this.store.dispatch(GlobalActions.addGlobalToast({
          text: $event.errorInfo.message,
          severity: GlobalToastSeverity.ERROR,
        }));
        break;
      }
      case 'UploadSuccess': {
        this.store.dispatch(GlobalActions.addGlobalToast({
          text: `${$event.fileInfo.name} uploaded`,
          severity: GlobalToastSeverity.SUCCESS,
        }));
        this.addFileInfo($event.fileInfo.key);
        // this.testUploadResult.push($event.fileInfo);
        break;
      }
    }
  }

  getQueryParamsForAttachment(fileInfo: FileInfo) {
    return {
      'response-content-disposition': create(fileInfo.name, {type: 'attachment'}),
    };
  }
}
