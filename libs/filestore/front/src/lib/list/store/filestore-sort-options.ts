import { SortOption, SortOrder } from '@jellyblog-nest/utils/common';
import { FileInfo } from './file-info';

export const availableSortOptions: SortOption<FileInfo>[] = [
  {
    label: 'Название по алфавиту',
    field: 'name',
    order: SortOrder.ASC,
  },
  {
    label: 'Название в обратном порядке',
    field: 'name',
    order: SortOrder.DESC,
  },
  {
    label: 'Дата начиная с новых',
    field: 'LastModified',
    order: SortOrder.DESC,
  },
  {
    label: 'Дата начиная со старых',
    field: 'LastModified',
    order: SortOrder.ASC,
  },
  {
    label: 'Размер начиная с больших',
    field: 'Size',
    order: SortOrder.DESC,
  },
  {
    label: 'Размер начиная с маленьких',
    field: 'Size',
    order: SortOrder.ASC,
  },
];
