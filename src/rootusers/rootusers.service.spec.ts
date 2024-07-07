import { Test, TestingModule } from '@nestjs/testing';
import { RootusersService } from './rootusers.service';

describe('RootusersService', () => {
  let service: RootusersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RootusersService],
    }).compile();

    service = module.get<RootusersService>(RootusersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
