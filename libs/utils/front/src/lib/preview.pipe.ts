import { Pipe, PipeTransform } from '@angular/core';
import Showdown from 'showdown';
import ShowdownConverter = Showdown.Converter;
import { showdownConfig } from '@jellyblog-nest/utils/common';

export function previewMarkdown(val: string, converter: ShowdownConverter) {
  return converter.makeHtml(val);
}

@Pipe({
  name: 'preview',
  standalone: true,
})
export class PreviewPipe implements PipeTransform {
  private readonly converter = new Showdown.Converter(showdownConfig);

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
