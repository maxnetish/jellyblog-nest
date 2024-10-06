import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { RequireRole } from '@jellyblog-nest/auth/back';
import { PostPermission, PostStatus, SortOrder, UserRole } from '@jellyblog-nest/utils/common';
import { FindPostRequest, PostUpdateRequest } from '@jellyblog-nest/post/model';
import { Request } from 'express';
import { UserInfoDto } from '@jellyblog-nest/auth/model';
import { PostDto } from '@jellyblog-nest/post/model';
import { ToArrayPipe, ToDatePipe } from '@jellyblog-nest/utils/back';
import { transformAndAssert } from '@jellyblog-nest/utils/back';

@ApiTags('Post')
@Controller('post')
export class PostController {

  constructor(
    private readonly postService: PostService,
  ) {
  }

  @RequireRole(UserRole.ADMIN)
  @Post()
  @ApiBody({
    type: PostUpdateRequest,
    required: true,
  })
  @ApiResponse({
    type: PostDto,
  })
  create(@Body() postUpdateRequest: PostUpdateRequest, @Req() req: Request) {
    return this.postService.createOrUpdatePost({
      request: postUpdateRequest,
      user: req.user as UserInfoDto,
    });
  }

  @RequireRole(UserRole.ADMIN)
  @Put(':uuid')
  @ApiBody({
    type: PostUpdateRequest,
    required: true,
  })
  @ApiResponse({
    type: PostDto,
  })
  update(
    @Body() postUpdateRequest: PostUpdateRequest,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() req: Request,
  ) {
    return this.postService.createOrUpdatePost({
      request: postUpdateRequest,
      user: req.user as UserInfoDto,
      uuid,
    });
  }

  @RequireRole(UserRole.ADMIN)
  @Get('find-private')
  @ApiQuery({
    name: 'createdAtFrom',
    required: false,
  })
  @ApiQuery({
    name: 'createdAtTo',
    required: false,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: PostStatus,
    enumName: 'PostStatus',
    isArray: true,
    example: [PostStatus.DRAFT],
  })
  @ApiQuery({
    name: 'allowRead',
    required: false,
    enum: PostPermission,
    enumName: 'PostPermission',
    isArray: true,
    example: [PostPermission.FOR_ALL],
  })
  @ApiQuery({
    name: 'text',
    required: false,
  })
  @ApiQuery({
    name: 'tag',
    required: false,
    isArray: true,
    example: ['0325a15b-64cf-41f9-913f-8c4df3003f1b'],
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
      createdAt: SortOrder.DESC,
    },
  })
  async findPrivate(
    @Req() req: Request,
    @Query('createdAtFrom', ToDatePipe) createdAtFrom?: Date,
    @Query('createdAtTo', ToDatePipe) createdAtTo?: Date,
    @Query('status', ToArrayPipe) status?: PostStatus[],
    @Query('allowRead', ToArrayPipe) allowRead?: PostPermission[],
    @Query('text') text?: string,
    @Query('tag', ToArrayPipe) tag?: string[],
    @Query('page', ParseIntPipe) page = 1,
    @Query('size', ParseIntPipe) size = 10,
    @Query('order') order?: Partial<Record<keyof UserInfoDto, SortOrder>>,
  ) {
    const findPostRequest = await transformAndAssert({
      cls: FindPostRequest,
      plain: {
        createdAtFrom,
        createdAtTo,
        status,
        allowRead,
        text,
        tag,
        page,
        size,
        order,
      },
      transformOptions: {excludeExtraneousValues: false},
    });
    return this.postService.findPostsPrivate({
      request: findPostRequest,
      user: req.user as UserInfoDto,
    });
  }

  @Get(':uuid')
  @ApiResponse({
    type: PostDto,
  })
  async get(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() req: Request,
  ) {
    return this.postService.getPostById({
      uuid,
      user: req.user as UserInfoDto,
    });
  }

}
