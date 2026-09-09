import { Controller, Get, Query } from '@nestjs/common';
import { DashService } from './dash.service';

@Controller('dash')
export class DashController {
  constructor(private readonly dashService: DashService) {}

  @Get('stats')
  getStats(@Query('workspaceId') workspaceId?: string) {
    return this.dashService.getStats(workspaceId);
  }

  @Get('recent-certifications')
  getRecentCertifications(@Query('workspaceId') workspaceId?: string) {
    return this.dashService.getRecentCertifications(workspaceId);
  }

  @Get('login-activity')
  getLoginActivity(@Query('workspaceId') workspaceId?: string) {
    return this.dashService.getLoginActivity(workspaceId);
  }
}
