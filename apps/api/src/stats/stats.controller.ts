import { Controller, Get, Headers } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('analytics')
  getAnalytics(@Headers('x-workspace-id') workspaceId?: string) {
    return this.statsService.getAnalytics(workspaceId);
  }

  @Get('compliance')
  getCompliance(@Headers('x-workspace-id') workspaceId?: string) {
    return this.statsService.getCompliance(workspaceId);
  }
}
