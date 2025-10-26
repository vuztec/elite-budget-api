import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { AuditService } from './audit.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Audit } from './entities/audit.entity';

@ApiTags('audit')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new audit record' })
  @ApiResponse({ status: 201, description: 'Audit record created successfully', type: Audit })
  create(@Body() createAuditDto: CreateAuditDto, @Request() req: any): Promise<Audit> {
    // Extract IP and User-Agent from request if not provided
    if (!createAuditDto.IpAddress) {
      createAuditDto.IpAddress = req.ip || req.connection.remoteAddress;
    }
    if (!createAuditDto.UserAgent) {
      createAuditDto.UserAgent = req.headers['user-agent'];
    }

    return this.auditService.create(createAuditDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all audit records' })
  @ApiResponse({ status: 200, description: 'List of all audit records', type: [Audit] })
  findAll(): Promise<Audit[]> {
    return this.auditService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get audit records for a specific user' })
  @ApiResponse({ status: 200, description: 'List of audit records for the user', type: [Audit] })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.auditService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific audit record' })
  @ApiResponse({ status: 200, description: 'Audit record found', type: Audit })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Audit> {
    return this.auditService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an audit record' })
  @ApiResponse({ status: 200, description: 'Audit record updated successfully', type: Audit })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAuditDto: UpdateAuditDto): Promise<Audit> {
    return this.auditService.update(id, updateAuditDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an audit record' })
  @ApiResponse({ status: 200, description: 'Audit record deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.auditService.remove(id);
  }
}
