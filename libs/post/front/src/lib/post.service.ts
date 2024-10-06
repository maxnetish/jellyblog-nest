import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FindPostRequest, PostDto, PostShortDto, PostUpdateRequest } from '@jellyblog-nest/post/model';
import { Page } from '@jellyblog-nest/utils/common';
import { sortableToQueryParam } from '@jellyblog-nest/utils/front';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly apiPath = '/api/post';

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  findPosts({request}: {
    request: FindPostRequest,
  }) {
    return this.httpClient.get<Page<PostShortDto>>(
      `${this.apiPath}/find-private`,
      {
        observe: 'body',
        responseType: 'json',
        params: {
          createdAtFrom: request.createdAtFrom?.toJSON() || [],
          createdAtTo: request.createdAtTo?.toJSON() || [],
          status: request.status || [],
          allowRead: request.allowRead || [],
          text: request.text || [],
          tag: request.tag || [],
          page: request.page || [],
          size: request.size || [],
          ...sortableToQueryParam<PostShortDto>(request),
        },
      },
    );
  }

  create({request}: { request: PostUpdateRequest }) {
    return this.httpClient.post<PostDto>(
      `${this.apiPath}`,
      request,
      {
        observe: 'body',
        responseType: 'json',
      },
    );
  }

  update({uuid, request}: { uuid: string; request: PostUpdateRequest }) {
    return this.httpClient.put<PostDto>(
      `${this.apiPath}/${uuid}`,
      request,
      {
        observe: 'body',
        responseType: 'json',
      },
    );
  }

  get({uuid}: { uuid: string }) {
    return this.httpClient.get<PostDto>(
      `${this.apiPath}/${uuid}`,
      {
        observe: 'body',
        responseType: 'json',
      },
    );
  }
}
