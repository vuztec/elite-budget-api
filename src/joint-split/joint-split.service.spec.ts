import { Test, TestingModule } from '@nestjs/testing';
import { JointSplitService } from './joint-split.service';

describe('JointSplitService', () => {
  let service: JointSplitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JointSplitService],
    }).compile();

    service = module.get<JointSplitService>(JointSplitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
