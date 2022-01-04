import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  CreateUserDto,
  CredentialsDto,
  FindUserRequest,
  SetPasswordDto,
  UpdateUserDto,
  UserInfoDto,
} from '@jellyblog-nest/auth/model';
import { BaseEntityId, Page } from '@jellyblog-nest/utils/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly apiPath = '/api/auth';

  private findUserRequestToHttpParams(findUserRequest: FindUserRequest) {
    let result = new HttpParams()
      .append('page', findUserRequest.page)
      .append('size', findUserRequest.size);

    if (findUserRequest.order) {
      Object.entries(findUserRequest.order).forEach(([key, order]) => {
        result = result.append(`order[${key}]`, order);
      });
    }

    if (findUserRequest.role && findUserRequest.role.length) {
      result = result.appendAll({ role: findUserRequest.role });
    }

    if (findUserRequest.name) {
      result = result.append('name', findUserRequest.name);
    }

    return result;
  }

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
        params: this.findUserRequestToHttpParams(findUserRequest),
      },
    );
  }

  createUser(createUserDto: CreateUserDto) {
    return this.httpClient.post<UserInfoDto>(
      `${this.apiPath}/create`,
      createUserDto,
      {
        observe: 'body',
        responseType: 'json',
      },
    );
  }

  updateUser(updateUserDto: UpdateUserDto) {
    return this.httpClient.put<boolean>(
      `${this.apiPath}/user`,
      updateUserDto,
      {
        observe: 'body',
        responseType: 'json',
      },
    );
  }

  /**
   * Set password for user (intended for admin usage)
   */
  setPassword(setPasswordDto: SetPasswordDto) {
    return this.httpClient.put<boolean>(
      `${this.apiPath}/user/resetpassword`,
      setPasswordDto,
      {
        observe: 'body',
        responseType: 'json',
      },
    );
  }

  removeUser(request: BaseEntityId) {
    return this.httpClient.delete<boolean>(
      `${this.apiPath}/user`,
      {
        observe: 'body',
        responseType: 'json',
        body: request,
      },
    );
  }
}
