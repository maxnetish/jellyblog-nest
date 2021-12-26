import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingDto, SettingUpdateDto } from '@jellyblog-nest/settings/model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {

  private readonly apiPath = '/api/settings';

  constructor(
    private readonly httpClient: HttpClient,
  ) {
  }

  findCommon() {
    return this.httpClient.get<SettingDto[]>(
      `${this.apiPath}`,
      {
        observe: 'body',
        responseType: 'json',
      },
    );
  }

  findPrivate() {
    return this.httpClient.get<SettingDto[]>(
      `${this.apiPath}/private`,
      {
        observe: 'body',
        responseType: 'json',
      },
    );
  }

  update(settingUpdateDto: SettingUpdateDto) {
    return this.httpClient.put(
      `${this.apiPath}`,
      settingUpdateDto,
      {
        observe: 'body',
        responseType: 'json',
      },
    );
  }
}
