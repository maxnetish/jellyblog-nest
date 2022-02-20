import { Pipe, PipeTransform } from '@angular/core';

export function getHumanFileSize(bytes?: number | string | null): string {
  const unitSize = 1024;
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];

  let bytesNumber = Number(bytes);

  if (isNaN(bytesNumber)) {
    return '';
  }

  if (Math.abs(bytesNumber) < unitSize) {
    return `${bytesNumber} ${units[0]}`;
  }

  let u = 0;

  do {
    bytesNumber /= unitSize;
    u++;
  } while (Math.round(bytesNumber * 100) / 100 >= unitSize && u < units.length - 1);

  const bytesLocalized = bytesNumber.toLocaleString();

  return `${bytesLocalized} ${units[u]}`;
}

@Pipe({
  name: 'fileSizeForHuman',
})
export class HumanFileSizePipe implements PipeTransform {

  transform(fileSizeBytes?: number | null): string {
    if (fileSizeBytes || fileSizeBytes === 0) {
      return getHumanFileSize(fileSizeBytes);
    }
    return '';
  }

}
