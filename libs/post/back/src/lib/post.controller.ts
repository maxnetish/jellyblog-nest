import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { Page, SortOrder } from '@jellyblog-nest/utils/common';
import { FindTagRequest, TagDto } from '@jellyblog-nest/post/model';
import { plainToClass } from 'class-transformer';

@ApiTags('Post')
@Controller('post')
export class PostController {

  constructor(
    private readonly postService: PostService,
  ) {
  }

  @Get('tags')
  @ApiQuery({
    name: 'content',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'size',
    type: Number,
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'order',
    required: false,
    style: 'deepObject',
    explode: true,
    type: 'object',
    example: {
      content: SortOrder.ASC,
    },
  })
  @ApiResponse({
    type: Page,
    isArray: false,
  })
  findTags(
    @Query('content') content = '',
    @Query('page', ParseIntPipe) page = 1,
    @Query('size', ParseIntPipe) size = 10,
    @Query('order') order?: Partial<Record<keyof TagDto, SortOrder>>,
  ) {
    const findTagsRequest = plainToClass(FindTagRequest, {
      content,
      page,
      size,
      order,
    }, {excludeExtraneousValues: false});
    return this.postService.findTags(findTagsRequest);
  }

}
