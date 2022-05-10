import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Like, Repository } from 'typeorm';
import { Post, Tag } from '@jellyblog-nest/entities';
import { FindTagRequest, TagDto } from '@jellyblog-nest/post/model';
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

}
