import { Test, TestingModule } from '@nestjs/testing';
import { JointSplitController } from './joint-split.controller';
import { JointSplitService } from './joint-split.service';

describe('JointSplitController', () => {
  let controller: JointSplitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JointSplitController],
      providers: [JointSplitService],
    }).compile();

    controller = module.get<JointSplitController>(JointSplitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
