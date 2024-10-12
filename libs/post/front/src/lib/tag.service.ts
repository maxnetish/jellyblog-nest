import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FindTagRequest, TagDto, TagUpdateRequest } from '@jellyblog-nest/post/model';
import { sortableToQueryParam } from '@jellyblog-nest/utils/front';
import { Page } from '@jellyblog-nest/utils/common';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private readonly apiPath = '/api/tag';
  private readonly http = inject(HttpClient);

  createTag({request}: { request: TagUpdateRequest }) {
    return this.http.post<TagDto>(
      `${this.apiPath}`,
      request,
      {
        observe: 'body',
        responseType: 'json',
      },
    );
  }

  updateTag({request, id}: { request: TagUpdateRequest; id: string; }) {
    return this.http.put<TagDto>(
      `${this.apiPath}`,
      request,
      {
        observe: 'body',
        responseType: 'json',
        params: {
          uuid: id,
        },
      },
    );
  }

  remove({id}: { id: string }) {
    return this.http.delete<TagDto>(
      `${this.apiPath}`,
      {
        observe: 'body',
        responseType: 'json',
        params: {
          uuid: id,
        },
      },
    );
  }

  findTags({request}: { request: FindTagRequest }) {
    return this.http.get<Page<TagDto>>(
      `${this.apiPath}/find`,
      {
        observe: 'body',
        responseType: 'json',
        params: {
          content: request.content || [],
          page: request.page || [],
          size: request.size || [],
          ...sortableToQueryParam<TagDto>(request),
        },
      },
    );
  }
}
