import { SettingName } from '@jellyblog-nest/utils/common';
import { Setting } from '@jellyblog-nest/entities';

export const settingsDefault: Partial<Setting>[] = [
  {
    name: SettingName.S3_ACCESS_KEY,
    label: 'Access key',
    value: '',
    description: 'S3 compatible file store: access key of s3 api user with read/write permission',
    secure: true,
  },
  {
    name: SettingName.S3_ACCESS_SECRET,
    label: 'Access secret',
    value: '',
    description: 'S3 compatible file store: access secret of s3 api user',
    secure: true,
  },
  {
    name: SettingName.S3_REGION,
    label: 'Region',
    value: '',
    description: 'S3 compatible file store: region of cloud storage, ex. "eu-central-1" (mandatory if we use Amazon Web Services storage)',
    secure: false,
  },
  {
    name: SettingName.S3_BUCKET,
    label: 'Bucket',
    value: 'jbfs',
    description: 'S3 compatible file store: bucket name, all uploaded files will be in specified bucket)',
    secure: false,
  },
  {
    name: SettingName.S3_ENDPOINT,
    label: 'Endpoint',
    value: '',
    description: 'S3 compatible file store: api endpoint (mandatory if we use not Amazon Web Services storage, ex. spaces in Digital Ocean)',
    secure: false,
  },
  {
    name: SettingName.S3_PUBLIC_ENDPOINT,
    label: 'Public endpoint',
    value: '',
    description: 'Host to use as public storage endpoint. Cloudfront or some other... Public url will be like "[public endpoint]/[file key]". Mandatory field.',
    secure: false,
  },
];
