import { Body, Controller, Delete, Get, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { RequireRole } from '@jellyblog-nest/auth/back';
import { Page, SortOrder, UserRole } from '@jellyblog-nest/utils/common';
import { FindTagRequest, TagDto, UpdateTagRequest } from '@jellyblog-nest/post/model';
import { plainToClass } from 'class-transformer';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(
    private readonly tagService: TagService,
  ) {
  }

  @Post()
  @RequireRole(UserRole.ADMIN)
  @ApiBody({
    type: UpdateTagRequest,
    required: true,
    examples: {
      'Tag example': {
        value: {
          content: 'Jelly pony',
        },
      },
    },
  })
  @ApiResponse({
    type: TagDto,
  })
  createTag(@Body() request: UpdateTagRequest) {
    return this.tagService.createOrUpdateTag({request});
  }

  @Put()
  @RequireRole(UserRole.ADMIN)
  @ApiBody({
    type: UpdateTagRequest,
    required: true,
    examples: {
      'Tag example': {
        value: {
          content: 'Jelly pony',
        },
      },
    },
  })
  @ApiQuery({
    name: 'uuid',
    required: true,
  })
  @ApiResponse({
    type: TagDto,
  })
  updateTag(@Body() request: UpdateTagRequest, @Query('uuid') uuid: string) {
    return this.tagService.createOrUpdateTag({request, uuid});
  }

  @Delete()
  @RequireRole(UserRole.ADMIN)
  @ApiQuery({
    name: 'uuid',
    required: true,
  })
  @ApiResponse({
    type: TagDto,
  })
  remove(@Query('uuid') uuid: string) {
    return this.tagService.removeTag({uuid});
  }

  @Get('find')
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
    return this.tagService.findTags(findTagsRequest);
  }
}
