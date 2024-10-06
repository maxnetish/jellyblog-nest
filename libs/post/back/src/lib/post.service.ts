import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindOptionsWhere, Repository } from 'typeorm';
import { Post } from '@jellyblog-nest/entities';
import { FindPostRequest, PostDto, PostShortDto, PostUpdateRequest } from '@jellyblog-nest/post/model';
import { Page, PostPermission, PostStatus } from '@jellyblog-nest/utils/common';
import { UserInfoDto } from '@jellyblog-nest/auth/model';
import { createOrUpdatePost } from './service/create-or-update';
import { findPrivate } from './service/find';
import { canViewPost } from './service/post-permission';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {
  }

  async findPostsPrivate({request, user}: {request: FindPostRequest, user: UserInfoDto}): Promise<Page<PostShortDto>> {
    return findPrivate({request, user, postRepository: this.postRepository});
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
    const permit = canViewPost({postEntity, user});

    if(!permit) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return postEntity;
  }

  async createOrUpdatePost({request, user, uuid}: { request: PostUpdateRequest, user: UserInfoDto, uuid?: string }) {
    return createOrUpdatePost({request, user, uuid, postRepository: this.postRepository});
  }

}
