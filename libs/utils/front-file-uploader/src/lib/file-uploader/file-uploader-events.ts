import { PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { FileInfo } from './file-info';

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

export type UploadEvent = UploadBeginEvent | UploadSuccessEvent | UploadErrorEvent;
