import { Test, TestingModule } from '@nestjs/testing';
import { ExtraFundsTrackerController } from './extra-funds-tracker.controller';
import { ExtraFundsTrackerService } from './extra-funds-tracker.service';

describe('ExtraFundsTrackerController', () => {
  let controller: ExtraFundsTrackerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExtraFundsTrackerController],
      providers: [ExtraFundsTrackerService],
    }).compile();

    controller = module.get<ExtraFundsTrackerController>(ExtraFundsTrackerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
