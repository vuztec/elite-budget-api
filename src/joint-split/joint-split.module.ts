import { Module } from '@nestjs/common';
import { JointSplitService } from './joint-split.service';
import { JointSplitController } from './joint-split.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JointSplit } from './entities/joint-split.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JointSplit])],
  controllers: [JointSplitController],
  providers: [JointSplitService],
})
export class JointSplitModule {}
