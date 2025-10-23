import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { Audit, AuditAction } from './entities/audit.entity';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
    @InjectRepository(Rootuser)
    private readonly userRepository: Repository<Rootuser>,
  ) {}

  async create(createAuditDto: CreateAuditDto): Promise<Audit> {
    const user = await this.userRepository.findOne({
      where: { id: createAuditDto.UserId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const audit = this.auditRepository.create({
      Action: createAuditDto.Action,
      AutoRenewalStatus: createAuditDto.AutoRenewalStatus,
      IpAddress: createAuditDto.IpAddress,
      UserAgent: createAuditDto.UserAgent,
      Notes: createAuditDto.Notes,
      User: user,
      ActionDate: new Date(),
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    });

    return this.auditRepository.save(audit);
  }

  async logAutoRenewalChange(
    userId: number,
    newStatus: boolean,
    ipAddress?: string,
    userAgent?: string,
    notes?: string,
  ): Promise<Audit> {
    const action = newStatus ? AuditAction.AUTO_RENEWAL_ENABLED : AuditAction.AUTO_RENEWAL_DISABLED;

    return this.create({
      Action: action,
      AutoRenewalStatus: newStatus,
      UserId: userId,
      IpAddress: ipAddress,
      UserAgent: userAgent,
      Notes: notes || `Auto renewal ${newStatus ? 'enabled' : 'disabled'} by user`,
    });
  }

  async findAll(): Promise<Audit[]> {
    return this.auditRepository.find({
      relations: ['User'],
      order: { ActionDate: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Audit[]> {
    return this.auditRepository.find({
      where: { User: { id: userId } },
      relations: ['User'],
      order: { ActionDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Audit> {
    return this.auditRepository.findOne({
      where: { id },
      relations: ['User'],
    });
  }

  async update(id: number, updateAuditDto: UpdateAuditDto): Promise<Audit> {
    await this.auditRepository.update(id, updateAuditDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.auditRepository.delete(id);
  }
}
