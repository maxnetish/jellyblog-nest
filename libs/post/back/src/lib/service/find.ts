import { Brackets, Repository } from 'typeorm';
import { Post } from '@jellyblog-nest/entities';
import { FindPostRequest, PostShortDto } from '@jellyblog-nest/post/model';
import { UserInfoDto } from '@jellyblog-nest/auth/model';
import { Page, UserRole } from '@jellyblog-nest/utils/common';
import { HttpException, HttpStatus } from '@nestjs/common';

export async function findPrivate({request, user, postRepository}: {
  request: FindPostRequest;
  user: UserInfoDto;
  postRepository: Repository<Post>;
}) {
  if (user?.role !== UserRole.ADMIN) {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
  }

  const {allowRead, text, status, createdAtFrom, createdAtTo, order, page, size, tag} = request;
  const postAlias = 'post';
  // Use query builder

  // Add projection and criteria
  const query = postRepository.createQueryBuilder(postAlias)
    .select([
      `${postAlias}.uuid`,
      `${postAlias}.createdAt`,
      `${postAlias}.status`,
      `${postAlias}.allowRead`,
      `${postAlias}.author`,
      `${postAlias}.title`,
      `${postAlias}.hru`,
    ])
    .leftJoinAndSelect(`${postAlias}.tags`, 'tag')
    .where(`${postAlias}.author = :author`, {author: user.username})
    .andWhere(
      (tag && tag.length)
        ? `tag.uuid IN (:...tag)`
        : 'TRUE',
      {tag},
    )
    .andWhere(
      (allowRead && allowRead.length)
        ? `${postAlias}.allowRead IN (:...allowRead)`
        : 'TRUE',
      {allowRead},
    )
    .andWhere(
      (status && status.length)
        ? `${postAlias}.status IN (:...status)`
        : 'TRUE',
      {status},
    )
    .andWhere(
      (createdAtFrom && !isNaN(createdAtFrom.valueOf()))
        ? `${postAlias}.createdAt >= date(:createdAtFrom)`
        : 'TRUE',
      {createdAtFrom: createdAtFrom?.toISOString()},
    )
    .andWhere(
      (createdAtTo && !isNaN(createdAtTo.valueOf()))
        ? `${postAlias}.createdAt <= date(:createdAtTo)`
        : 'TRUE',
      {createdAtTo: createdAtTo?.toISOString()},
    );

  if (text) {
    query.andWhere(new Brackets((wb) => {
      wb
        .where(`${postAlias}.title LIKE :titleLike`, {titleLike: `%${text}%`})
        .orWhere(`${postAlias}.content LIKE :contentLike`, {contentLike: `%${text}%`})
    }));
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
        tags: p.tags.map(t => ({uuid: t.uuid, content: t.content})),
      };
    }),
    total,
    size,
    page,
  } as Page<PostShortDto>;
}
