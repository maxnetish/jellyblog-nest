import { Pipe, PipeTransform } from '@angular/core';

export function buildS3FileUrl(
  key: string,
  endpoint?: string | null,
  query?: Record<string, string> | null,
): string {

  let result = `${endpoint || ''}/${key}`;

  if (query) {
    const queryString = Object.keys(query).map((key) => {
      return `${key}=${encodeURI(query[key])}`;
    }).join('&');
    result = `${result}?${queryString}`;
  }

  return result;
}

@Pipe({
  name: 's3FileUrl',
})
export class S3FileUrlPipe implements PipeTransform {

  transform(
    key: string,
    endpoint?: string | null,
    query?: Record<string, string> | null,
  ): string {
    return buildS3FileUrl(key, endpoint, query);
  }

}
