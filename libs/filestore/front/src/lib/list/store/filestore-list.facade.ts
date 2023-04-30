import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFilestoreListActions from './filestore-list.actions';
import * as fromFilestoreListSelectors from './filestore-list.selectors';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { SettingsFacade } from '@jellyblog-nest/settings/front';
import { SettingName, SortOption, SortOrder } from '@jellyblog-nest/utils/common';
import { FileInfo } from './file-info';
import { filestoreListComparators } from './filestore-list-comparators';

export interface FolderInfo {
  name: string;
  prefix: string;
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

  private sortIconMap: Record<SortOrder, string> = {
    [SortOrder.ASC]: 'heroBarsArrowDown',
    [SortOrder.DESC]: 'heroBarsArrowUp',
  };

  files$: Observable<FileInfo[]> = combineLatest([
    this.store.select(fromFilestoreListSelectors.selectListObjectsCommandsOutputs),
    this.store.select(fromFilestoreListSelectors.selectDelimiter),
    this.store.select(fromFilestoreListSelectors.selectSort),
  ]).pipe(
    map(([outputs, delimiter, sort]): FileInfo[] => {
      const result = outputs
        .reduce((acc, output) => {
          return [
            ...acc,
            ...(output.Contents || []).map((objectInfo): FileInfo => {
              return {
                name: objectInfo.Key
                  ? objectInfo.Key.split(delimiter).pop() || ''
                  : '',
                ...objectInfo,
              };
            }),
          ];
        }, [] as FileInfo[]);
      const getComparator = filestoreListComparators[sort.field];
      if (getComparator) {
        result.sort(getComparator(sort.order));
      }
      return result;
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

  sortLabel$: Observable<string> = this.store.select(
    fromFilestoreListSelectors.selectSort,
  ).pipe(
    map((sort) => {
      return sort.label;
    }),
  );

  sortOrder$: Observable<SortOrder> = this.store.select(
    fromFilestoreListSelectors.selectSort,
  ).pipe(
    map((sort) => {
      return sort.order;
    }),
  );

  sortIcon$: Observable<string> = this.sortOrder$.pipe(
    map((sortOrder) => {
      return this.sortIconMap[sortOrder];
    }),
  );

  readonly prefix$ = this.store.select(fromFilestoreListSelectors.selectPrefix);

  private static removeEndingDelimiter(path: string | null | undefined, delimiter: string) {
    return (path && path.endsWith(delimiter))
      ? path.substring(0, path.length - 1)
      : path;
  }

  handleBeginBrowse() {
    this.store.dispatch(fromFilestoreListActions.beginBrowse());
  }

  handleChangeFolder(prefix: string) {
    this.store.dispatch(fromFilestoreListActions.changeFolder({prefix}));
  }

  handleChangeSort(sort: SortOption<FileInfo>) {
    this.store.dispatch(fromFilestoreListActions.changeSort({sort}));
  }

  handleDeleteObject(key?: string) {
    if (key) {
      this.store.dispatch(fromFilestoreListActions.deleteObject({key}));
    }
  }

  handleRenameObject(currentKey: string, newKey: string) {
    if (currentKey && newKey) {
      this.store.dispatch(fromFilestoreListActions.renameObject({
        newKey,
        currentKey,
      }));
    }
  }

}


