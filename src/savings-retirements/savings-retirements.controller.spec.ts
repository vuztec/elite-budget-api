import { Test, TestingModule } from '@nestjs/testing';
import { SavingsRetirementsController } from './savings-retirements.controller';
import { SavingsRetirementsService } from './savings-retirements.service';

describe('SavingsRetirementsController', () => {
  let controller: SavingsRetirementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavingsRetirementsController],
      providers: [SavingsRetirementsService],
    }).compile();

    controller = module.get<SavingsRetirementsController>(SavingsRetirementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
