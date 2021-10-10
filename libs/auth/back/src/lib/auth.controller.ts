import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, CredentialsDto, UserInfoDto } from '@jellyblog-nest/auth/model';
import { LoginGuard } from './login.guard';
import { Request } from 'express';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from './authenticated.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @UseGuards(AuthenticatedGuard)
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.createUser(createUserDto);
  }

  @UseGuards(LoginGuard)
  @Post('login')
  @ApiBody({
    type: CredentialsDto,
    required: true,
  })
  @ApiResponse({
    type: UserInfoDto,
  })
  login(@Req() req: Request): UserInfoDto {
    return req.user as UserInfoDto;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    req.logout();
  }

  @ApiResponse({
    type: UserInfoDto,
  })
  @Get('user')
  getCurrentUser(@Req() req: Request): UserInfoDto | null {
    if(req.isAuthenticated()) {
      return req.user as UserInfoDto;
    }
    return null;
  }
}
