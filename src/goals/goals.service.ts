import { Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { Repository } from 'typeorm';
import { GOAL_TYPE } from '@/shared/enums/enum';

@Injectable()
export class GoalsService {
  constructor(@InjectRepository(Goal) private readonly goalRepo: Repository<Goal>) {}

  create(createGoalDto: CreateGoalDto, user: Rootuser, type: GOAL_TYPE) {
    const new_goal = new Goal();

    // new_goal.Category = createGoalDto.Category;
    new_goal.Percentage = createGoalDto.Percentage;
    new_goal.Type = type;

    new_goal.Root = user;

    return this.goalRepo.save(new_goal);
  }

  async findAll(user: Rootuser, type: GOAL_TYPE) {
    const goals = await this.goalRepo
      .createQueryBuilder('goal')
      .where('goal.rootid = :id', { id: user.id })
      .andWhere('goal.Type = :type', { type })
      .getMany();

    goals.sort((a, b) => {
      if (a.Category < b.Category) return -1;
      if (a.Category > b.Category) return 1;
      return 0;
    });

    return goals;
  }

  findOne(id: number) {
    return this.goalRepo.findOne({ where: { id } });
  }

  async update(id: number, updateGoalDto: UpdateGoalDto) {
    const new_goal = await this.goalRepo.findOne({ where: { id } });

    new_goal.Percentage = updateGoalDto.Percentage;

    return this.goalRepo.save(new_goal);
  }

  remove(id: number) {
    return this.goalRepo.delete(id);
  }
}
