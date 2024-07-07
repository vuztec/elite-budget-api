import { Test, TestingModule } from '@nestjs/testing';
import { SavingsRetirementsService } from './savings_retirements.service';

describe('SavingsRetirementsService', () => {
  let service: SavingsRetirementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SavingsRetirementsService],
    }).compile();

    service = module.get<SavingsRetirementsService>(SavingsRetirementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
