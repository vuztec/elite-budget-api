import { Test, TestingModule } from '@nestjs/testing';
import { ExtraPayChecksService } from './extra-pay-checks.service';

describe('ExtraPayChecksService', () => {
  let service: ExtraPayChecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtraPayChecksService],
    }).compile();

    service = module.get<ExtraPayChecksService>(ExtraPayChecksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
