import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CredentialsDto, UserInfoDto } from '@jellyblog-nest/auth/model';

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

}
