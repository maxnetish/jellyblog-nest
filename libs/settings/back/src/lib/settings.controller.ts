import { Body, Controller, Get, Put } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequireRole } from '@jellyblog-nest/auth/back';
import { SettingName, UserRole } from '@jellyblog-nest/utils/common';
import { UpdateResult } from 'typeorm';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
  ) {
  }

  @Get()
  @ApiResponse({
    isArray: true,
  })
  async findCommon() {
    return this.settingsService.find();
  }

  @Get('private')
  @ApiResponse({
    isArray: true,
    type: Object,
  })
  @RequireRole(UserRole.ADMIN)
  async findPrivate() {
    return this.settingsService.find({withSecure: true});
  }

  @Put()
  @ApiResponse({
    type: UpdateResult,
  })
  @RequireRole(UserRole.ADMIN)
  async updateSetting(@Body() {name, value}: { name: SettingName, value?: string }) {
    return this.settingsService.update({name, value});
  }
}
