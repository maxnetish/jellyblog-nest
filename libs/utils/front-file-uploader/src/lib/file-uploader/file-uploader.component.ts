import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef, OnInit, OnDestroy, input, output, signal,
} from '@angular/core';
import { concatMap, from, Subject, takeUntil, tap } from 'rxjs';
import {
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { v4 } from 'uuid';
import { UploadEvent } from './file-uploader-events';
import { fileInfoFromFile } from './file-info';

@Component({
  selector: 'mg-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FileUploaderComponent implements OnInit, OnDestroy {

  /**
   * multiple attribute of file input element
   */
  readonly multiple = input(false);

  /**
   * accept attribute of file input element
   */
  readonly accept = input('');

  /**
   * S3 config options
   */
  readonly s3Config = input<S3ClientConfig>({});

  /**
   * s3 bucket name
   */
  readonly s3Bucket = input<string | null>(null);

  /**
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/modules/putobjectrequest.html#tagging
   */
  readonly s3Tagging = input<string | null>(null);

  /**
   * Any additional metadata (original file name will include in)
   * See https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/modules/putobjectrequest.html#metadata
   */
  readonly s3Meta = input<Record<string, string>>({});

  /**
   * Button css class
   *
   * @default btn btn-primary
   */
  readonly buttonClass = input<string>('btn btn-primary');

  readonly buttonText = input<string>();

  /**
   * "Folder" to upload file(s). File key will prepends with prefix.
   * "cool/images/" -> file will be at "cool/images/[key]".
   * Should ends with path delimiter ("/")
   */
  readonly prefix = input<string>();

  /**
   * If true - we use original file name as file key.
   * Else key will be new uuid.
   *
   * @default false
   */
  readonly revealOriginalFileName = input(false);

  readonly uploadEvents = output<UploadEvent>();

  @ViewChild('fileInputRef') fileInputRef?: ElementRef<HTMLInputElement>;

  /**
   * You shouldn't subscribe.
   */
  private readonly pendingItem$ = new Subject<File>();
  private readonly unsubscribe$ = new Subject();
  private readonly pendingsCount = signal(0);

  private async uploadOneFile(file: File) {

    const prefix = this.prefix() || '';
    const s3Filename = this.revealOriginalFileName()
      ? file.name
      : v4();
    const key = `${prefix}${s3Filename}`;

    const putCommand = new PutObjectCommand({
      Key: key,
      Body: file,
      Bucket: this.s3Bucket() || undefined,
      ContentType: file.type,
      Metadata: {
        ...(this.s3Meta() || {}),
        originalname: encodeURI(file.name),
      },
      Tagging: this.s3Tagging() || undefined,
    });

    this.uploadEvents.emit({
      type: 'UploadBegin',
      fileInfo: fileInfoFromFile(file, putCommand.input.Key),
    });

    try {
      const client = new S3Client({
        ...this.s3Config(),
      });
      const result = await client.send(putCommand);
      client.destroy();
      this.uploadEvents.emit({
        type: 'UploadSuccess',
        fileInfo: fileInfoFromFile(file, putCommand.input.Key),
        resultInfo: result,
      });
      return true;
    } catch (err) {
      this.uploadEvents.emit({
        type: 'UploadError',
        fileInfo: fileInfoFromFile(file, putCommand.input.Key),
        errorInfo: err,
      });
      return false;
    }
  }

  private handleUploadCompleteOrError() {
    this.pendingsCount.update((val) => val - 1);
    if (this.pendingsCount() === 0) {
      this.uploadEvents.emit({
        type: 'UploadQueueExhaust',
      });
    }
  }

  protected handleButtonClick($event: MouseEvent) {
    if (this.fileInputRef && this.fileInputRef.nativeElement) {
      this.fileInputRef.nativeElement.click();
    }
  }

  protected handleFileInputChange(fileInput: HTMLInputElement) {
    const files = Array.prototype.slice.call(fileInput.files || []) as File[];
    return this.addFilesToUpload(files);
  }

  private addFilesToUpload(files: File[]) {
    files.forEach(oneFile => this.pendingItem$.next(oneFile));
  }

  ngOnInit(): void {
    this.pendingItem$.pipe(
      tap((oneFile) => {
        this.pendingsCount.update((val) => val + 1);
        this.uploadEvents.emit({
          type: 'UploadItemAdded',
          file: oneFile,
          pendingFilesCount: this.pendingsCount(),
        });
      }),
      concatMap((oneFile) => {
        return from(this.uploadOneFile(oneFile));
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe({
      next: () => this.handleUploadCompleteOrError(),
      error: () => this.handleUploadCompleteOrError(),
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
