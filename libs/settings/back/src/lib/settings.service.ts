import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Setting } from '@jellyblog-nest/entities';
import { Equal, FindOptionsWhere, Not, Repository } from 'typeorm';
import { SettingName } from '@jellyblog-nest/utils/common';
import { settingsDefault } from '@jellyblog-nest/utils/back';
import { SettingDto, SettingUpdateDto } from '@jellyblog-nest/settings/model';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting) private readonly settingRepository: Repository<Setting>,
  ) {
    this.seedDefaultSettings();
  }

  async find({
               settingName,
               withSecure,
             }: { settingName?: SettingName, withSecure?: boolean } = {}): Promise<SettingDto[]> {
    const where: FindOptionsWhere<Setting> = {};

    if (settingName) {
      where.name = Equal(settingName);
    }

    if (!withSecure) {
      where.secure = Not(Equal(true));
    }

    const result = await this.settingRepository.find({
        where,
      },
    );

    return result
      .map((setting) => {
        return {
          name: setting.name,
          value: setting.value,
          description: setting.description,
          label: setting.label,
        };
      });
  }

  async update({name, value}: SettingUpdateDto) {
    return await this.settingRepository.update(
      {name},
      {value},
    );
  }

  async updateMany(updates: SettingUpdateDto[]) {
    return Promise.all(updates.map((updateDto) => {
      return this.update(updateDto);
    }));
  }

  private async seedDefaultSettings() {
    const existentSettings = await this.find({withSecure: true});
    const settingsToInserts = settingsDefault
      .filter((settingDefault) => {
        return !existentSettings.some(ent => ent.name === settingDefault.name);
      });

    return this.settingRepository.insert(settingsToInserts);
  }
}
