import { Test, TestingModule } from '@nestjs/testing';
import { RootusersController } from './rootusers.controller';
import { RootusersService } from './rootusers.service';

describe('RootusersController', () => {
  let controller: RootusersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RootusersController],
      providers: [RootusersService],
    }).compile();

    controller = module.get<RootusersController>(RootusersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
