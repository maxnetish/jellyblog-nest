import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CredentialsDto, FindUserRequest, UserInfoDto } from '@jellyblog-nest/auth/model';
import { Page } from '@jellyblog-nest/utils/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly apiPath = '/api/auth';

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  getCurrentUser() {
    return this.httpClient.get<UserInfoDto>(
      `${this.apiPath}/user`,
      {
        observe: 'body',
        responseType: 'json',
      },
    );
  }

  login(credentialsDto: CredentialsDto) {
    return this.httpClient.post<UserInfoDto>(
      `${this.apiPath}/login`,
      credentialsDto,
      {
        observe: 'body',
        responseType: 'json',
      },
    );
  }

  logout() {
    return this.httpClient.post(
      `${this.apiPath}/logout`,
      null,
      {
        observe: 'body',
        responseType: 'json',
      },
    );
  }

  findUsers(findUserRequest: FindUserRequest) {
    return this.httpClient.get<Page<UserInfoDto>>(
      `${this.apiPath}/users`,
      {
        observe: 'body',
        responseType: 'json',
        params: findUserRequest.toHttpParams(),
      },
    );
  }

}
