import { BaseEntity } from './base.entity';
import { Column, Entity } from 'typeorm';
import { SettingName } from '@jellyblog-nest/utils/common';

@Entity()
export class Setting extends BaseEntity {
  @Column({type: 'varchar'})
  name: SettingName = SettingName.S3_ACCESS_KEY;

  @Column({type: 'varchar'})
  label = '';

  @Column({type: 'varchar', nullable: true})
  value: string | null = null;

  @Column({type: 'varchar'})
  description = '';

  @Column({type: 'boolean', default: true})
  secure = true;
}
