import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindOptionsWhere, Repository } from 'typeorm';
import { Post } from '@jellyblog-nest/entities';
import { FindPostRequest, PostDto, PostShortDto, PostUpdateRequest } from '@jellyblog-nest/post/model';
import { Page, PostPermission, PostStatus } from '@jellyblog-nest/utils/common';
import { UserInfoDto } from '@jellyblog-nest/auth/model';
import { createOrUpdatePost } from './service/create-or-update';
import { findPrivate } from './service/find';

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

  async createOrUpdatePost({request, user, uuid}: { request: PostUpdateRequest, user: UserInfoDto, uuid?: string }) {
    return createOrUpdatePost({request, user, uuid, postRepository: this.postRepository});
  }

}
