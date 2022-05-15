import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindConditions, Like, Repository } from 'typeorm';
import { Post, Tag } from '@jellyblog-nest/entities';
import { FindPostRequest, FindTagRequest, PostShortDto, PostUpdateRequest, TagDto } from '@jellyblog-nest/post/model';
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

  async findPosts(request: FindPostRequest, author: string): Promise<Page<PostShortDto>> {
    const {allowRead, text, status, createdAtFrom, createdAtTo, order, page, size} = request;
    const postAlias = 'post';
    // Use query builder

    // Add projection and criteria
    const query = this.postRepository.createQueryBuilder(postAlias)
      .select([
        `${postAlias}.uuid`,
        `${postAlias}.createdAtt`,
        `${postAlias}.status`,
        `${postAlias}.allowRead`,
        `${postAlias}.author`,
        `${postAlias}.title`,
        `${postAlias}.hru`,
      ])
      .where(`${postAlias}.author = :author`, {author});

    if (allowRead && allowRead.length) {
      query.andWhere(`${postAlias}.allowRead IN (:...allowRead)`, {allowRead});
    }

    if (text) {
      query.andWhere(new Brackets((wb) => {
        wb
          .where(`${postAlias}.title LIKE :titleLike`, {titleLile: `%${text}%`})
          .orWhere(`${postAlias}.content LIKE :contentLike`, {contentLike: `%${text}%`})
      }));
    }

    query.andWhere((status && status.length) ? `${postAlias}.status IN (:...status)` : 'TRUE', {status});

    if (createdAtFrom && !isNaN(createdAtFrom.valueOf())) {
      query.andWhere(`${postAlias}.createdAt >= date(:createdAtFrom)`, {createdAtFrom: createdAtFrom.toISOString()});
    }

    if (createdAtTo && !isNaN(createdAtTo.valueOf())) {
      query.andWhere(`${postAlias}.createdAt <= date(:createdAtTo)`, {createdAtTo: createdAtTo.toISOString()});
    }

    // add sort order
    if (order) {
      Object.entries(order).forEach(([field, sortOrder], index) => {
        if (index === 0) {
          query.orderBy(`${postAlias}.${field}`, sortOrder);
        } else {
          query.addOrderBy(`${postAlias}.${field}`, sortOrder);
        }
      });
    }

    // add pagination
    query
      .skip((page - 1) * size)
      .take(size);

    // execute query
    const [posts, total] = await query.getManyAndCount();

    return {
      list: posts.map((p) => {
        return {
          uuid: p.uuid,
          createdAt: p.createdAt,
          title: p.title,
          status: p.status,
          author: p.author,
          hru: p.hru,
          allowRead: p.allowRead,
        };
      }),
      total,
      size,
      page,
    } as Page<PostShortDto>;
  }

  async getPostByAnyId(uuidOrHumanId: string): Promise<Post | undefined> {
    const where: FindConditions<Post>[] = [
      {
        uuid: uuidOrHumanId,
      },
      {
        hru: uuidOrHumanId,
      },
    ];

    return this.postRepository.findOne({
      where,
      relations: ['tags'],
    });
  }

  async getPostById(uuid: string): Promise<Post | undefined> {
    return this.postRepository.findOne(
      uuid,
      {
        relations: ['tags'],
      },
    );
  }

  // async createOrUpdatePost(request: PostUpdateRequest): Promise<string> {
  //
  // }

}
