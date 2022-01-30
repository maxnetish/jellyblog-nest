import { FileInfo } from './file-info';
import { SortOrder } from '@jellyblog-nest/utils/common';

export const filestoreListComparators: Partial<Record<keyof FileInfo, (order: SortOrder) => (a: FileInfo, b: FileInfo) => number>> = {

  name: (order) => {
    if(order === SortOrder.ASC) {
      return (a, b) => {
        return a.name.localeCompare(b.name);
      }
    }
    return (a, b) => {
      return -a.name.localeCompare(b.name);
    }
  },

  Size: (order) => {
    if(order===SortOrder.ASC) {
      return (a, b) => {
        return (a.Size || 0) - (b.Size || 0);
      };
    }
    return (a, b) => {
      return (b.Size || 0) - (a.Size || 0);
    };
  },

  LastModified: (order) => {
    if(order===SortOrder.ASC) {
      return (a, b) => {
        if (a.LastModified && b.LastModified) {
          return a.LastModified.valueOf() - b.LastModified.valueOf();
        }
        return 0;
      }
    }
    return (a, b) => {
      if (a.LastModified && b.LastModified) {
        return b.LastModified.valueOf() - a.LastModified.valueOf();
      }
      return 0;
    }
  },

}
