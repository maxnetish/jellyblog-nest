import { FileDropItem } from './file-drop-item';

interface AcceptPatterns {
  mime: RegExp[];
  ext: string[];
}

export async function extractFiles({list, traverseDirectories = false, accept = '*'}: {
  list: DataTransferItemList;
  traverseDirectories?: boolean;
  accept?: string;
}) {
  const result: FileDropItem[] = [];
  const patterns = acceptRegex(accept);

  for (const item of Array.from(list)) {
    const files = await extractFilesFromDataTransferItem({item, traverseDirectories, patterns});
    Array.prototype.push.apply(result, files);
  }
  return result;
}

async function extractFilesFromDataTransferItem({item, traverseDirectories, patterns}: {
  item: DataTransferItem;
  traverseDirectories?: boolean;
  patterns: AcceptPatterns;
}): Promise<FileDropItem[]> {
  const fsEntry = extractFileSystemEntry(item);

  if (!fsEntry) {
    return [];
  }

  if (fsEntry.isFile) {
    const filePossibleNull = item.getAsFile();
    if (filePossibleNull && accept({file: filePossibleNull, patterns})) {
      return [{
        file: filePossibleNull,
        filesystemEntry: fsEntry,
      }];
    }
    return [];
  }

  if (traverseDirectories && fsEntry.isDirectory) {
    return collectFilesFromDirectory({
      directory: fsEntry as FileSystemDirectoryEntry,
      patterns,
    });
  }

  return [];

}

async function collectFilesFromDirectory({directory, patterns}: {
  directory: FileSystemDirectoryEntry;
  patterns: AcceptPatterns
}): Promise<FileDropItem[]> {
  const reader = directory.createReader();
  const collectedFiles: FileDropItem[] = [];
  return new Promise<FileDropItem[]>((resolve, reject) => {
    reader.readEntries(
      async (entries) => {
        try {
          for (const entry of entries) {
            if (entry.isFile) {
              const file = await fileFromFileEntry({fileEntry: entry as FileSystemFileEntry});
              if (accept({file, patterns})) {
                collectedFiles.push({
                  file: file,
                  filesystemEntry: entry,
                });
              }
            }
            if (entry.isDirectory) {
              const children = await collectFilesFromDirectory({
                directory: entry as FileSystemDirectoryEntry,
                patterns,
              });
              Array.prototype.push.apply(collectedFiles, children);
            }
          }
          resolve(collectedFiles);
        } catch (error) {
          reject(error);
        }
      },
      (err) => {
        reject(err);
      },
    );
  });
}

function fileFromFileEntry({fileEntry}: { fileEntry: FileSystemFileEntry }) {
  return new Promise<File>((resolve, reject) => {
    fileEntry.file(
      (file) => {
        resolve(file);
      },
      (err) => {
        reject(err);
      },
    );
  });
}

function extractFileSystemEntry(item: DataTransferItem) {
  if ('getAsEntry' in item) {
    return (item as any).getAsEntry() as FileSystemEntry;
  }
  return item.webkitGetAsEntry();
}

function accept({file, patterns}: { patterns: AcceptPatterns; file: File; }) {
  if (patterns.ext.length === 0 && patterns.mime.length === 0) {
    return true;
  }

  const fileNameExt = extractFilenameExtention(file.name);

  if (patterns.ext.includes(fileNameExt)) {
    return true;
  }

  if (patterns.mime.some((oneMime) => {
    return (file.type || '').match(oneMime);
  })) {
    return true;
  }

  return false;
}

function extractFilenameExtention(filename: string) {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot > -1) {
    return filename.substring(lastDot + 1).toUpperCase();
  }
  return '';
}

function acceptRegex(accept = '*'): AcceptPatterns {
  const result: { mime: RegExp[]; ext: string[]; } = {
    mime: [],
    ext: [],
  };

  const acceptParts = accept
    .split(',')
    .map((part) => {
      return part.trim();
    })
    .filter((part) => {
      return !!part;
    });

  if (acceptParts.some(part => part === '*')) {
    return result;
  }

  acceptParts.forEach((part) => {
    if (part.startsWith('.')) {
      const partWithoutDot = part.slice(1);
      if (partWithoutDot) {
        result.ext.push(partWithoutDot.toUpperCase());
      }
    } else {
      const pattern = part.replace(/\*/, '.*');
      result.mime.push(new RegExp(pattern));
    }
  });

  return result;
}
