import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { PostService } from './post.service';

@ApiTags('Post')
@Controller('post')
export class PostController {

  constructor(
    private readonly postService: PostService,
  ) {
  }

}
