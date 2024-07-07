import { Test, TestingModule } from '@nestjs/testing';
import { ExtraFundsTrackerService } from './extra-funds-tracker.service';

describe('ExtraFundsTrackerService', () => {
  let service: ExtraFundsTrackerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtraFundsTrackerService],
    }).compile();

    service = module.get<ExtraFundsTrackerService>(ExtraFundsTrackerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
