import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindOptionsWhere, Repository } from 'typeorm';
import { Post } from '@jellyblog-nest/entities';
import { FindPostRequest, PostShortDto, PostUpdateRequest } from '@jellyblog-nest/post/model';
import { Page, PostPermission, PostStatus } from '@jellyblog-nest/utils/common';
import { UserInfoDto } from '@jellyblog-nest/auth/model';
import { PostDto } from '../../../model/src/lib/post-dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {
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
          .where(`${postAlias}.title LIKE :titleLike`, {titleLike: `%${text}%`})
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
    const where: FindOptionsWhere<Post>[] = [
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

  async getPostById({uuid, user}: {uuid: string, user?: UserInfoDto}): Promise<PostDto> {
    const postEntity = await this.postRepository.findOne({
      where: {
        uuid,
      },
      relations: ['tags'],
    });

    // detect post permissions for current user
    // TODO move to special method
    let permit = false;
    // by post status
    switch (postEntity.status) {
      case PostStatus.DRAFT: {
        // only author can see draft
        permit = user && postEntity.author === user.username;
        break;
      }
      case PostStatus.PUB: {
        switch (postEntity.allowRead) {
          case PostPermission.FOR_ALL: {
            permit = true;
            break;
          }
          case PostPermission.FOR_REGISTERED: {
            permit = !!user;
            break;
          }
          case PostPermission.FOR_ME: {
            permit = user && postEntity.author === user.username;
            break;
          }
        }
        break;
      }
    }

    if(!permit) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return postEntity;

  }

  async createOrUpdatePost({request, user, uuid}: { request: PostUpdateRequest, user: UserInfoDto, uuid?: string }): Promise<PostDto> {

    if (uuid) {
      const existingPost = await this.postRepository.findOneByOrFail({uuid});

      // Check that post update by author
      if (existingPost.author !== user.username) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
      }
    }

    // include only attributes updated by user

    const postEntity = this.postRepository.create({
      uuid,
      tags: request.tags || [],
      allowRead: request.allowRead,
      title: request.title,
      brief: request.brief,
      content: request.content,
      contentType: request.contentType,
    });

    const resultEntity = await this.postRepository.save(postEntity);

    return {
      uuid: resultEntity.uuid,
      createdAt: resultEntity.createdAt,
      title: resultEntity.title,
      status: resultEntity.status,
      author: resultEntity.author,
      hru: resultEntity.hru,
      allowRead: resultEntity.allowRead,
      updatedAt: resultEntity.updatedAt,
      tags: resultEntity.tags,
      pubDate: resultEntity.pubDate,
      brief: resultEntity.brief,
      content: resultEntity.content,
      contentType: resultEntity.contentType,
      attachments: resultEntity.attachments,
      titleImg: resultEntity.titleImg,
    };

  }

}
