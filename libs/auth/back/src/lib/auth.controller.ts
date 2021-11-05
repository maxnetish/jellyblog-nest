import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, CredentialsDto, FindUserRequest, UserInfoDto } from '@jellyblog-nest/auth/model';
import { LoginGuard } from './login.guard';
import { Request } from 'express';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from './authenticated.guard';
import { SortOrder, UserRole } from '@jellyblog-nest/utils/common';
import { FindUserRequestPipe } from './find-user-request.pipe';

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
    if (req.isAuthenticated()) {
      return req.user as UserInfoDto;
    }
    return null;
  }

  @ApiQuery({
    name: 'name',
    required: false,
  })
  @ApiQuery({
    name: 'role',
    enum: UserRole,
    isArray: true,
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'size',
    type: Number,
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'order',
    required: false,
    style: 'deepObject',
    explode: true,
    type: 'object',
    example: {
      username: SortOrder.ASC,
    },
  })
  @ApiResponse({
    type: UserInfoDto,
    isArray: true,
  })
  @UseGuards(AuthenticatedGuard)
  @Get('users')
  findUsers(
    @Query(FindUserRequestPipe, new ValidationPipe({ transform: true })) findUserRequest: FindUserRequest,
  ) {
    return this.authService.find(findUserRequest);
  }
}
