import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@Controller('activity-log')
@UseGuards(JwtAuthGuard)
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  async findAll(
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return this.activityLogService.findAll(skip, take);
  }

  @Get('stats')
  async getStats() {
    return this.activityLogService.getStats();
  }

  @Get('user/:userId')
  async findByUser(
    @Param('userId') userId: string,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return this.activityLogService.findByUser(userId, skip, take);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.activityLogService.findOne(id);
  }
}
