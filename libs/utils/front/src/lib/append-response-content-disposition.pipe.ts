import { Pipe, PipeTransform } from '@angular/core';
import { create } from 'content-disposition-header';

export function appendResponseContentDisposition(baseUrl?: string | null, fileName?: string | null, disposition?: 'attachment' | 'inline' | null) {
  let queryParam = disposition
    ? `response-content-disposition=${encodeURIComponent(create(fileName || undefined, {type: disposition}))}`
    : '';
  const baseUrlNorm = baseUrl || '';
  if (queryParam) {
    queryParam = baseUrlNorm.includes('?')
      ? `&${queryParam}`
      : `?${queryParam}`;
  }
  return `${baseUrlNorm}${queryParam}`;
}

/**
 * Добавить к урлу параметр "response-content-disposition".
 * Чтобы сервер отдал файл с соответствующим заголовком content=disposition
 */
@Pipe({
  name: 'appendResponseContentDisposition',
  standalone: true,
})
export class AppendResponseContentDispositionPipe implements PipeTransform {

  transform(baseUrl?: string | null, fileName?: string | null, disposition?: 'attachment' | 'inline' | null): string {
    return appendResponseContentDisposition(
      baseUrl,
      fileName,
      disposition,
    );
  }

}
