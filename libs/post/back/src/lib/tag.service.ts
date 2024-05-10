import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '@jellyblog-nest/entities';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { FindTagRequest, TagDto, UpdateTagRequest } from '@jellyblog-nest/post/model';
import { Page } from '@jellyblog-nest/utils/common';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {
  }

  async findTags(request: FindTagRequest): Promise<Page<TagDto>> {
    const {content, page, size, order} = request;
    const where: FindOptionsWhere<Tag> = {};

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
          list: foundTags.map((t) => {
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

  async createOrUpdateTag({request, uuid}: { request: UpdateTagRequest, uuid?: string }): Promise<TagDto> {
    const tagEntity = this.tagRepository.create({
      content: request.content,
      uuid,
    });
    const resultTag = await this.tagRepository.save(tagEntity);
    return {
      uuid: resultTag.uuid,
      content: resultTag.content,
    };
  }

  async removeTag({uuid}: { uuid: string }): Promise<TagDto> {
    const removingTag = await this.tagRepository.findOneOrFail({where: {uuid}});
    const resultTag = await this.tagRepository.remove(removingTag);
    return {
      uuid: resultTag.uuid,
      content: resultTag.content,
    };
  }

}
