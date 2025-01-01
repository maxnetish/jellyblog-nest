import { Pipe, PipeTransform } from '@angular/core';
import * as Showdown from 'showdown';

export function previewMarkdown(val: string, converter: Showdown.Converter) {
  return converter.makeHtml(val);
}

@Pipe({
  name: 'preview',
  standalone: true,
})
export class PreviewPipe implements PipeTransform {
  private converter = new Showdown.Converter();

  /**
   * Make html preview from markdown string 
   * @param value 
   * @param format 
   * @returns 
   */
  transform(value: string | null | undefined, format: 'none' | 'markdown' = 'none') {
    if (value && format === 'markdown') {
      return previewMarkdown(value, this.converter);
    }
    
    return value;
  }
}
