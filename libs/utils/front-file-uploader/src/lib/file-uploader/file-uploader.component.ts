import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef, Output, EventEmitter, OnInit, OnDestroy,
} from '@angular/core';
import { BehaviorSubject, concatMap, from, Subject, takeUntil, tap } from 'rxjs';
import {
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { v4 } from 'uuid';
import { UploadEvent } from './file-uploader-events';
import { FileInfo } from './file-info';

@Component({
  selector: 'mg-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploaderComponent implements OnInit, OnDestroy {

  @Input() set multiple(val: boolean) {
    this.multiple$.next(val);
  }

  @Input() set accept(val: string) {
    this.accept$.next(val);
  }

  @Input() set hideButton(val: boolean) {
    this.showButton$.next(!val);
  }

  @Input() s3Config?: S3ClientConfig | null = {};
  @Input() s3Bucket?: string | null;
  /**
   * See https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/modules/putobjectrequest.html#tagging
   */
  @Input() s3Tagging?: string | null;
  /**
   * Any additional metadata (original file name will include in)
   * See https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/modules/putobjectrequest.html#metadata
   */
  @Input() s3Meta?: Record<string, string>;
  @Input() buttonClass = 'btn btn-primary';
  @Input() buttonText?: string;
  /**
   * "Folder" to upload file(s). File key will prepends with prefix.
   * "cool/images/" -> file will be at "cool/images/[key]".
   * Shouls ends with path delimiter ("/")
   */
  @Input() prefix?: string;
  /**
   * If true - we use original file name as file key.
   * Else (default) - key will be new uuid.
   */
  @Input() revealOriginalFileName?: boolean;

  @Output() uploadEvents = new EventEmitter<UploadEvent>();

  @ViewChild('fileInputRef') fileInputRef?: ElementRef<HTMLInputElement>;

  multiple$ = new BehaviorSubject(false);
  accept$ = new BehaviorSubject('');
  showButton$ = new BehaviorSubject(true);

  /**
   * You shouldn't subscribe.
   */
  private _pendingItems$ = new Subject<File>();
  private unsubscribe$ = new Subject();
  private _pendingsCount = 0;

  private async _uploadOneFile(file: File) {

    const prefix = this.prefix || '';
    const s3Filename = this.revealOriginalFileName
      ? file.name
      : v4();
    const key = `${prefix}${s3Filename}`;

    const putCommand = new PutObjectCommand({
      Key: key,
      Body: file,
      Bucket: this.s3Bucket || undefined,
      ContentType: file.type,
      Metadata: {
        ...(this.s3Meta || {}),
        originalname: encodeURI(file.name),
      },
      Tagging: this.s3Tagging || undefined,
    });

    this.uploadEvents.emit({
      type: 'UploadBegin',
      fileInfo: FileInfo.fromFile(file, putCommand.input.Key),
    });

    try {
      const client = new S3Client({
        ...this.s3Config,
      });
      const result = await client.send(putCommand);
      client.destroy();
      this.uploadEvents.emit({
        type: 'UploadSuccess',
        fileInfo: FileInfo.fromFile(file, putCommand.input.Key),
        resultInfo: result,
      });
      return true;
    } catch (err) {
      this.uploadEvents.emit({
        type: 'UploadError',
        fileInfo: FileInfo.fromFile(file, putCommand.input.Key),
        errorInfo: err,
      });
      return false;
    }
  }

  private handleUploadCompleteOrError() {
    this._pendingsCount--;
    if (this._pendingsCount === 0) {
      this.uploadEvents.emit({
        type: 'UploadQueueExhaust',
      });
    }
  }

  handleButtonClick($event: MouseEvent) {
    if (this.fileInputRef && this.fileInputRef.nativeElement) {
      this.fileInputRef.nativeElement.click();
    }
  }

  handleFileInputChange(fileInput: HTMLInputElement) {
    const files = Array.prototype.slice.call(fileInput.files || []) as File[];
    return this.addFilesToUpload(files);
  }

  addFilesToUpload(files: File[]) {
    files.forEach(oneFile => this._pendingItems$.next(oneFile));
  }

  ngOnInit(): void {
    this._pendingItems$.pipe(
      tap((oneFile) => {
        this._pendingsCount++;
        this.uploadEvents.emit({
          type: 'UploadItemAdded',
          file: oneFile,
          pendingFilesCount: this._pendingsCount,
        });
      }),
      concatMap((oneFile) => {
        return from(this._uploadOneFile(oneFile));
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
