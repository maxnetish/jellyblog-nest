import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFilestoreListActions from './filestore-list.actions';
import * as fromFilestoreListSelectors from './filestore-list.selectors';
import { map } from 'rxjs/operators';
import { _Object } from '@aws-sdk/client-s3';
import { combineLatest, Observable } from 'rxjs';
import { SettingsFacade } from '@jellyblog-nest/settings/front';
import { SettingName } from '@jellyblog-nest/utils/common';

export interface FolderInfo {
  name: string;
  prefix: string;
}

export interface FileInfo extends _Object{
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class FilestorelistFacade {

  constructor(
    private readonly store: Store,
    private readonly settingsFacade: SettingsFacade,
  ) {
  }

  files$: Observable<FileInfo[]> = combineLatest([
    this.store.select(fromFilestoreListSelectors.selectListObjectsCommandsOutputs),
    this.store.select(fromFilestoreListSelectors.selectDelimiter),
  ]).pipe(
    map(([outputs, delimiter]): FileInfo[] => {
      return outputs.reduce((acc, output) => {
        return [
          ...acc,
          ...(output.Contents || []).map((objectInfo): FileInfo=> {
            return {
              name: objectInfo.Key
                ? objectInfo.Key.split(delimiter).pop() || ''
                : '',
              ...objectInfo
            };
          }),
        ];
      }, [] as FileInfo[]);
    }),
  );

  folders$: Observable<FolderInfo[]> = combineLatest([
    this.store.select(fromFilestoreListSelectors.selectListObjectsCommandsOutputs),
    this.store.select(fromFilestoreListSelectors.selectDelimiter),
  ]).pipe(
    map(([outputs, delimiter]) => {
      return outputs.reduce((acc, output) => {
        return [
          ...acc,
          ...(output.CommonPrefixes || [])
            .map((commonPrefix) => {
              const prefixWithoutEndingDelimiter = FilestorelistFacade.removeEndingDelimiter(commonPrefix.Prefix, delimiter);
              return {
                name: prefixWithoutEndingDelimiter
                  ? prefixWithoutEndingDelimiter.split(delimiter).pop() || ''
                  : '',
                prefix: commonPrefix.Prefix || '',
              };
            }),
        ];
      }, [] as FolderInfo[]);
    }),
  );

  parentFoldersHierarchy$: Observable<FolderInfo[]> = combineLatest([
    this.store.select(fromFilestoreListSelectors.selectPrefix),
    this.store.select(fromFilestoreListSelectors.selectDelimiter),
    this.settingsFacade.getSetting$(SettingName.S3_BUCKET),
  ]).pipe(
    map(([prefix, delimiter, bucket]): FolderInfo[] => {
      const rootFolder: FolderInfo = {
        prefix: '',
        name: bucket || 'Root',
      };
      if (!prefix) {
        return [rootFolder];
      }
      const prefixWithoutEndingSeparator = FilestorelistFacade.removeEndingDelimiter(prefix, delimiter) || '';
      const prefixParts = prefixWithoutEndingSeparator.split(delimiter);
      const folders: FolderInfo[] = [];
      while (prefixParts.length) {
        folders.push({
          prefix: `${prefixParts.join(delimiter)}${delimiter}`,
          name: prefixParts.pop() || '',
        });
      }
      return [
        rootFolder,
        ...folders.reverse(),
      ];
    }),
  );

  parentFolder$: Observable<FolderInfo | null> = combineLatest([
    this.store.select(fromFilestoreListSelectors.selectPrefix),
    this.store.select(fromFilestoreListSelectors.selectDelimiter),
  ]).pipe(
    map(([prefix, delimiter]): FolderInfo | null => {
        if (!prefix) {
          return null;
        }
        const prefixWithoutEndingSeparator = FilestorelistFacade.removeEndingDelimiter(prefix, delimiter) || '';
        const prefixParts = prefixWithoutEndingSeparator.split(delimiter);
        prefixParts.pop();
        return {
          name: '..',
          prefix: prefixParts.length
            ? `${prefixParts.join(delimiter)}${delimiter}`
            : '',
        };
      },
    ),
  );

  currentPath$: Observable<string> = combineLatest([
    this.store.select(fromFilestoreListSelectors.selectPrefix),
    this.store.select(fromFilestoreListSelectors.selectDelimiter),
    this.settingsFacade.getSetting$(SettingName.S3_BUCKET),
  ]).pipe(
    map(([prefix, delimiter, bucket]) => {
      return `${bucket}${delimiter}${prefix}`;
    }),
  );

  private static removeEndingDelimiter(path: string | null | undefined, delimiter: string) {
    return (path && path.endsWith(delimiter))
      ? path.substring(0, path.length - 1)
      : path;
  }

  handleBeginBrowse() {
    this.store.dispatch(fromFilestoreListActions.beginBrowse());
  }

  handleChangeFolder(prefix: string) {
    this.store.dispatch(fromFilestoreListActions.changeFolder({ prefix }));
  }


}
