import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, CredentialsDto } from '@jellyblog-nest/auth/model';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() credentials: CredentialsDto) {
    return await this.authService.findAndVerify(credentials);
  }
}
