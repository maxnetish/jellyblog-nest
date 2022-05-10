import { Pageable } from '@jellyblog-nest/utils/common';
import { TagDto } from './tag-dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

type SortableTag = Omit<TagDto, 'uuid'>;

export class FindTagRequest extends Pageable<SortableTag>{
  @IsString()
  @MaxLength(128)
  @IsOptional()
  content?: string;
}
