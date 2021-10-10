import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfoDto } from '@jellyblog-nest/auth/model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiPath = '/api/auth';

  constructor(
    private httpClient: HttpClient,
  ) { }

  getCurrentUser() {
    return this.httpClient.get<UserInfoDto>(
      `${this.apiPath}/user`,
      {
        observe: 'body',
        responseType: 'json',
      },
    );
  }

}
