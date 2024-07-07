import { Module } from '@nestjs/common';
import { JointSplitService } from './joint-split.service';
import { JointSplitController } from './joint-split.controller';

@Module({
  controllers: [JointSplitController],
  providers: [JointSplitService],
})
export class JointSplitModule {}
