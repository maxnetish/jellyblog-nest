import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { RequireRole } from '@jellyblog-nest/auth/back';
import { UserRole } from '@jellyblog-nest/utils/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @RequireRole(UserRole.ADMIN)
  @Get('example-auth-request')
  getPrivate() {
    return 'bar';
  }

  @Get('example-open-request')
  getPublic() {
    return 'bar';
  }
}
