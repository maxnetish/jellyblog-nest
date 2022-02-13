import { HeadObjectCommandOutput } from '@aws-sdk/client-s3';

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
