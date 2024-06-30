import { Sortable, SortOrder } from '@jellyblog-nest/utils/common';

export function sortableToQueryParam<T>(sortableDto: Sortable<T>): Partial<Record<keyof T, SortOrder>> {
  if (sortableDto.order) {
    const entries = Object.entries(sortableDto.order);
    return entries.reduce((acc, entry) => {
      return {
        ...acc,
        [`order[${entry[0]}]`]: entry[1],
      };
    }, {});
  }
  return {};
}
