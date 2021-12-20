import { Test } from '@nestjs/testing';
import { SettingsService } from './settings.service';

describe('SettingsBackService', () => {
  let service: SettingsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SettingsService],
    }).compile();

    service = module.get(SettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
