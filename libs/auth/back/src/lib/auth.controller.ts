import { Body, Controller, Delete, Get, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, CredentialsDto, FindUserRequest, UpdateUserDto, UserInfoDto } from '@jellyblog-nest/auth/model';
import { LoginGuard } from './login.guard';
import { Request } from 'express';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseEntityId, Page, SortOrder, UserRole } from '@jellyblog-nest/utils/common';
import { plainToClass } from 'class-transformer';
import { ToArrayPipe } from '@jellyblog-nest/utils/back';
import { RequireRole } from './require-role.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {
  }

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.createUser(createUserDto);
  }

  @UseGuards(LoginGuard)
  @Post('login')
  @ApiBody({
    type: CredentialsDto,
    required: true
  })
  @ApiResponse({
    type: UserInfoDto
  })
  login(@Req() req: Request): UserInfoDto {
    return req.user as UserInfoDto;
  }

  @Post('logout')
  logout(@Req() req: Request) {
    req.logout();
  }

  @RequireRole()
  @ApiResponse({
    type: UserInfoDto
  })
  @Get('user')
  getCurrentUser(@Req() req: Request): UserInfoDto | null {
    if (req.isAuthenticated()) {
      return req.user as UserInfoDto;
    }
    return null;
  }

  @RequireRole(UserRole.ADMIN)
  @ApiBody({
    type: UpdateUserDto,
    required: true
  })
  @ApiResponse({
    type: Boolean,
    status: 200
  })
  @Put('user')
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(updateUserDto);
  }

  @RequireRole(UserRole.ADMIN)
  @ApiBody({
    type: BaseEntityId,
    required: true
  })
  @ApiResponse({
    type: Boolean,
    status: 200
  })
  @Delete('user')
  removeUser(@Body() removeRequest: BaseEntityId) {
    return this.authService.remove(removeRequest);
  }

  @RequireRole()
  @ApiQuery({
    name: 'name',
    required: false
  })
  @ApiQuery({
    name: 'role',
    enum: UserRole,
    enumName: 'UserRole',
    isArray: true,
    required: false,
    example: [UserRole.ADMIN]
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    example: 1
  })
  @ApiQuery({
    name: 'size',
    type: Number,
    required: false,
    example: 10
  })
  @ApiQuery({
    name: 'order',
    required: false,
    style: 'deepObject',
    explode: true,
    type: 'object',
    example: {
      username: SortOrder.ASC
    }
  })
  @ApiResponse({
    type: Page,
    isArray: false
  })
  @Get('users')
  findUsers(
    @Query('name') name = '',
    @Query('role', ToArrayPipe) role: UserRole[] = [],
    @Query('page', ParseIntPipe) page = 1,
    @Query('size', ParseIntPipe) size = 10,
    @Query('order') order?: Partial<Record<keyof UserInfoDto, SortOrder>>
  ) {
    const findUserRequest = plainToClass(FindUserRequest, {
      name,
      role,
      page,
      size,
      order
    }, { excludeExtraneousValues: false });
    return this.authService.find(findUserRequest);
  }
}
