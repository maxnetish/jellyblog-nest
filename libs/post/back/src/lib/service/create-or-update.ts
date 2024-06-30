import { PostUpdateRequest } from '@jellyblog-nest/post/model';
import { UserInfoDto } from '@jellyblog-nest/auth/model';
import { PostDto } from '@jellyblog-nest/post/model';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from '@jellyblog-nest/entities';

export async function createOrUpdatePost({request, user, uuid, postRepository}: {
  request: PostUpdateRequest;
  user: UserInfoDto;
  uuid?: string;
  postRepository: Repository<Post>;
}): Promise<PostDto> {

  if (uuid) {
    const existingPost = await postRepository.findOneByOrFail({uuid});

    // Check that post update by author
    if (existingPost.author !== user.username) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }
  }

  const postEntity = postRepository.create({
    uuid,
    tags: request.tags || [],
    allowRead: request.allowRead,
    title: request.title,
    brief: request.brief,
    content: request.content,
    contentType: request.contentType,
    author: user.username,
    hru: request.hru,
    titleImg: request.titleImg,
    attachments: request.attachments,
  });

  const resultEntity = await postRepository.save(postEntity);

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
