import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, Tag } from '@jellyblog-nest/entities';
import { PostController } from './post.controller';
import  {PostService} from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tag,
      Post,
    ]),
  ],
  controllers: [
    PostController,
  ],
  providers: [
    PostService,
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
