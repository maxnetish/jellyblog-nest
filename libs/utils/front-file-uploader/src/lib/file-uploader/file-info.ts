import { HeadObjectCommandOutput } from '@aws-sdk/client-s3';

export interface FileInfo {
  name: string;
  key: string;
  type?: string;
  length: number;
}

/**
 * File to FileInfo
 * @param file File
 * @param key Storage key
 */
export function fileInfoFromFile(file: File, key?: string): FileInfo {
  return {
    key: key || '',
    length: file.size,
    name: file.name,
    type: file.type,
  };
}

/**
 * Reposnse os s3 storage to FileInfo
 * @param response s3 response
 * @param key s3 storage file key
 */
export function fileInfoFromHeadObjectCommandOutput(response: HeadObjectCommandOutput, key?: string): FileInfo {
  return {
    key: key || '',
    length: response.ContentLength || 0,
    name: response.Metadata && decodeURI(response.Metadata.originalname) || '',
    type: response.ContentType,
  };
}
