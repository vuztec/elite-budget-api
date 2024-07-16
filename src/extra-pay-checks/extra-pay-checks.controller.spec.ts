import { Test, TestingModule } from '@nestjs/testing';
import { ExtraPayChecksController } from './extra-pay-checks.controller';
import { ExtraPayChecksService } from './extra-pay-checks.service';

describe('ExtraPayChecksController', () => {
  let controller: ExtraPayChecksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExtraPayChecksController],
      providers: [ExtraPayChecksService],
    }).compile();

    controller = module.get<ExtraPayChecksController>(ExtraPayChecksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
