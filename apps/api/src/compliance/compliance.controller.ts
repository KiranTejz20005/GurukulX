import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { ComplianceService } from './compliance.service';

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('overview')
  async getOverview(@Headers('x-workspace-id') workspaceId?: string) {
    return this.complianceService.getOverview(workspaceId);
  }

  @Get('courses')
  async getCourses(@Headers('x-workspace-id') workspaceId?: string) {
    return this.complianceService.getCourses(workspaceId);
  }

  @Get('learners')
  async getLearners(
    @Query('courseId') courseId?: string,
    @Headers('x-workspace-id') workspaceId?: string,
  ) {
    return this.complianceService.getLearners(workspaceId, courseId);
  }

  @Post('create-course')
  async createCourse(
    @Body() body: { title: string; description?: string; validityMonths?: number; gracePeriodDays?: number },
    @Headers('x-workspace-id') workspaceId?: string,
  ) {
    return this.complianceService.createComplianceCourse(workspaceId, body);
  }

  @Post('waive')
  async waiveCompliance(@Body() body: { courseId: string; userId: string }) {
    return this.complianceService.waiveCompliance(body.courseId, body.userId);
  }

  @Post('reset')
  async resetCompliance(@Body() body: { courseId: string; userId: string }) {
    return this.complianceService.resetCompliance(body.courseId, body.userId);
  }
}
