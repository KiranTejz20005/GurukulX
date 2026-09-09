import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { IngestEventBatchDto } from './dto/ingest-event.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  async trackEvents(
    @Body() dto: IngestEventBatchDto,
    @Headers('cf-ipcountry') cfCountry?: string,
  ) {
    return this.analyticsService.trackEvents(dto, cfCountry);
  }

  @Get('landing-stats')
  async getLandingStats(
    @Query('days') days?: string,
    @Headers('x-workspace-id') workspaceId?: string,
  ) {
    const parsedDays = days ? parseInt(days, 10) : 30;
    return this.analyticsService.getLandingStats(workspaceId, isNaN(parsedDays) ? 30 : parsedDays);
  }

  @Get('course-funnel')
  async getCourseFunnel(
    @Query('days') days?: string,
    @Query('courseId') courseId?: string,
    @Headers('x-workspace-id') workspaceId?: string,
  ) {
    const parsedDays = days ? parseInt(days, 10) : 30;
    return this.analyticsService.getCourseFunnel(workspaceId, isNaN(parsedDays) ? 30 : parsedDays, courseId);
  }

  @Get('country-breakdown')
  async getCountryBreakdown(
    @Query('days') days?: string,
    @Headers('x-workspace-id') workspaceId?: string,
  ) {
    const parsedDays = days ? parseInt(days, 10) : 30;
    return this.analyticsService.getCountryBreakdown(workspaceId, isNaN(parsedDays) ? 30 : parsedDays);
  }

  @Get('top-courses')
  async getTopCourses(
    @Query('days') days?: string,
    @Headers('x-workspace-id') workspaceId?: string,
  ) {
    const parsedDays = days ? parseInt(days, 10) : 30;
    return this.analyticsService.getTopCourses(workspaceId, isNaN(parsedDays) ? 30 : parsedDays);
  }

  @Get('popular-types')
  async getPopularTypes(
    @Query('days') days?: string,
    @Headers('x-workspace-id') workspaceId?: string,
  ) {
    const parsedDays = days ? parseInt(days, 10) : 30;
    return this.analyticsService.getPopularTypes(workspaceId, isNaN(parsedDays) ? 30 : parsedDays);
  }
}
