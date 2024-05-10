import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, Tag } from '@jellyblog-nest/entities';
import { PostController } from './post.controller';
import  {PostService} from './post.service';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tag,
      Post,
    ]),
  ],
  controllers: [
    PostController,
    TagController,
  ],
  providers: [
    PostService,
    TagService,
  ],
  exports: [
    TypeOrmModule,
  ],
})
export class PostBackModule {

}

export {
  PostService,
}
