import { _Object } from '@aws-sdk/client-s3';

export interface FileInfo extends _Object {
  name: string;
}
