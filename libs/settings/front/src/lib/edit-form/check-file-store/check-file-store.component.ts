import {
  ChangeDetectionStrategy,
  Component, computed, inject, signal,
  ViewEncapsulation,
} from '@angular/core';
import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { SettingsFacade } from './../../store/settings.facade';
import {
  FileInfo, fileInfoFromHeadObjectCommandOutput, FileUploaderComponent,
  UploadEvents,
} from '@jellyblog-nest/utils/front-file-uploader';
import {
  AppendResponseContentDispositionPipe,
  GlobalActions,
  GlobalToastSeverity, HumanFileSizePipe,
  S3FileUrlPipe,
} from '@jellyblog-nest/utils/front';
import { Store } from '@ngrx/store';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCloudArrowUp } from '@ng-icons/heroicons/outline';

@Component({
    selector: 'app-settings-check-file-store',
    templateUrl: './check-file-store.component.html',
    styleUrls: ['./check-file-store.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FileUploaderComponent,
        S3FileUrlPipe,
        AppendResponseContentDispositionPipe,
        NgIconComponent,
        HumanFileSizePipe,
    ],
    providers: [
        provideIcons({
            heroCloudArrowUp,
        }),
    ]
})
export class CheckFileStoreComponent {

  private readonly store = inject(Store);
  protected readonly settingsFacade = inject(SettingsFacade);
  protected readonly testUploadResult = signal<FileInfo[]>([]);
  protected readonly testUploadresultLength = computed(() => {
    return this.testUploadResult().length;
  });

  private async getFileInfoFromStorage(fileId: string) {
    this.store.dispatch(GlobalActions.addGlobalToast({
      text: `Fetch file info of ${fileId} from storage`,
      severity: GlobalToastSeverity.INFO,
    }));

    try {
      const s3Config = this.settingsFacade.s3ClientConfig();
      const s3Bucket = this.settingsFacade.s3Bucket();

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
      const fileInfo = fileInfoFromHeadObjectCommandOutput(response, fileId);
      this.testUploadResult.update((val) => {
        return [
          ...val,
          fileInfo
        ];
      });
    }
  }

  handleTestUploadEvents($event: UploadEvents.UploadEvent) {
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
        break;
      }
    }
  }

}
