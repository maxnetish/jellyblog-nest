import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { RequireRole } from '@jellyblog-nest/auth/back';
import { UserRole } from '@jellyblog-nest/utils/common';
import { PostUpdateRequest } from '@jellyblog-nest/post/model';
import { Request } from 'express';
import { UserInfoDto } from '@jellyblog-nest/auth/model';
import { PostDto } from '@jellyblog-nest/post/model';

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
  create(@Body() postUpdateRequest: PostUpdateRequest, @Req() req: Request) {
    return this.postService.createOrUpdatePost({
      request: postUpdateRequest,
      user: req.user as UserInfoDto,
    });
  }

}
