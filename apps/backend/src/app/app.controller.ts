import { Controller, Get, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { AuthenticatedGuard, LoginGuard } from '@jellyblog-nest/auth/back';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('example-auth-request')
  @UseGuards(AuthenticatedGuard)
  getPrivate() {
    return 'bar';
  }

  @Get('example-open-request')
  getPublic() {
    return 'bar';
  }
}
