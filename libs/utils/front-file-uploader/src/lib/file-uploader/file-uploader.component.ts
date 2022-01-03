import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef, Output, EventEmitter,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { S3ClientConfig } from '@aws-sdk/client-s3/dist-types/S3Client';
import { HeadObjectCommandOutput, PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { v4 } from 'uuid';

export interface FileInfo {
  name: string;
  key: string;
  type: string;
  length: number;
}

export class FileInfo {
  static fromFile(file: File, key?: string) {
    return {
      key: key || '',
      length: file.size,
      name: file.name,
      type: file.type,
    } as FileInfo;
  }
  static fromHeadObjectCommandOutput(response: HeadObjectCommandOutput, key?: string) {
    return {
      key: key || '',
      length: response.ContentLength,
      name: response.Metadata && decodeURI(response.Metadata.originalname),
      type: response.ContentType,
    } as FileInfo;
  }
}

export interface UploadBeginEvent {
  type: 'UploadBegin';
  fileInfo: FileInfo;
}

export interface UploadSuccessEvent {
  type: 'UploadSuccess';
  fileInfo: FileInfo;
  resultInfo: PutObjectCommandOutput;
}

export interface UploadErrorEvent {
  type: 'UploadError';
  fileInfo: FileInfo;
  errorInfo: any;
}

@Component({
  selector: 'mg-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploaderComponent implements OnInit {

  @Input() set multiple(val: boolean) {
    this.multiple$.next(val);
  }

  @Input() set accept(val: string) {
    this.accept$.next(val);
  }

  @Input() set hideButton(val: boolean) {
    this.showButton$.next(!val);
  }

  @Input() s3Config: S3ClientConfig | null = {};
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

  @Output() uploadEvents = new EventEmitter<UploadBeginEvent | UploadSuccessEvent | UploadErrorEvent>()

  @ViewChild('fileInputRef') fileInputRef?: ElementRef<HTMLInputElement>;

  multiple$ = new BehaviorSubject(false);
  accept$ = new BehaviorSubject('');
  showButton$ = new BehaviorSubject(true);

  private async uploadOneFile(client: S3Client, file: File) {

    const putCommand = new PutObjectCommand({
      Key: v4(),
      Body: file,
      Bucket: this.s3Bucket || undefined,
      ContentType: file.type,
      Metadata: {
        ...(this.s3Meta || {}),
        originalName: encodeURI(file.name),
      },
      Tagging: this.s3Tagging || undefined,
    });

    this.uploadEvents.emit({
      type: 'UploadBegin',
      fileInfo: FileInfo.fromFile(file, putCommand.input.Key),
    });

    try {
      const result = await client.send(putCommand);
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

  constructor() {
  }

  ngOnInit(): void {
  }

  handleButtonClick($event: MouseEvent) {
    if (this.fileInputRef && this.fileInputRef.nativeElement) {
      this.fileInputRef.nativeElement.click();
    }
  }


  async handleFileInputChange(fileInput: HTMLInputElement) {

    const s3Client = new S3Client({
      ...this.s3Config,
    });

    const files = Array.prototype.slice.call(fileInput.files || []) as File[];

    const uploadPromises = files.map((file) => {
      return this.uploadOneFile(s3Client, file);
    });

    try {
      await Promise.all(uploadPromises);
    } finally {
      s3Client.destroy();
    }
  }
}
