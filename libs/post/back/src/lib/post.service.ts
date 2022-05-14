import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindConditions, In, Like, Repository } from 'typeorm';
import { Post, Tag } from '@jellyblog-nest/entities';
import { FindPostRequest, FindTagRequest, PostShortDto, TagDto } from '@jellyblog-nest/post/model';
import { Page } from '@jellyblog-nest/utils/common';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {
  }

  async findTags(request: FindTagRequest): Promise<Page<TagDto>> {
    const {content, page, size, order} = request;
    const where: FindConditions<Tag> = {};

    if (content) {
      where.content = Like(`%${content}%`);
    }

    const {list, total} = await this.tagRepository.findAndCount({
      select: ['uuid', 'content'],
      where,
      skip: (page - 1) * size,
      take: size,
      order,
    })
      .then(([foundTags, total]) => {
        return {
          list: foundTags.map((t)=>{
            return {
              uuid: t.uuid,
              content: t.content,
            };
          }),
          total,
        };
      });

    return {
      list,
      total,
      page,
      size,
    };
  }

  async findPosts(request: FindPostRequest): Promise<Page<PostShortDto>> {
    const {allowRead, text} = request;
    const where: FindConditions<Post> = {};

    if(allowRead && allowRead.length) {
      where.allowRead = In(allowRead);
    }

    if(text) {
      where.title = Like(`%${text}%`);
    }

    this.postRepository.createQueryBuilder('post')
      .where(new Brackets((web) => {
        web
          .where('post.allowRead IN (:...allowRead)', {allowRead})
          .orWhere(':withoutAllowRead', {withoutAllowRead: !allowRead});
      }))
      .orWhere()
  }

}
