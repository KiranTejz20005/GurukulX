import { Controller, Get, Post, Put, Delete, Body, Param, Headers, Request } from '@nestjs/common';
import { WidgetsService } from './widgets.service';

@Controller('widgets')
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

  private resolveWorkspaceId(headers: Record<string, string>, req: any): string {
    return headers['x-workspace-id'] || req.user?.workspaceId || 'dev-workspace-123';
  }

  // Public embed endpoint - no auth required
  @Get('embed/:id')
  getPublicEmbed(@Param('id') id: string) {
    return this.widgetsService.getPublicEmbed(id);
  }

  @Get()
  findAll(@Headers() headers: Record<string, string>, @Request() req: any) {
    const workspaceId = this.resolveWorkspaceId(headers, req);
    return this.widgetsService.findAll(workspaceId);
  }

  @Get(':id')
  findOne(
    @Headers() headers: Record<string, string>,
    @Request() req: any,
    @Param('id') id: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headers, req);
    return this.widgetsService.findOne(id, workspaceId);
  }

  @Post()
  create(
    @Headers() headers: Record<string, string>,
    @Request() req: any,
    @Body() body: { name: string; theme?: string; layout?: string; primaryColor?: string; courseIds?: string[] },
  ) {
    const workspaceId = this.resolveWorkspaceId(headers, req);
    return this.widgetsService.create(workspaceId, body);
  }

  @Put(':id')
  update(
    @Headers() headers: Record<string, string>,
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { name?: string; theme?: string; layout?: string; primaryColor?: string; courseIds?: string[] },
  ) {
    const workspaceId = this.resolveWorkspaceId(headers, req);
    return this.widgetsService.update(id, workspaceId, body);
  }

  @Delete(':id')
  remove(
    @Headers() headers: Record<string, string>,
    @Request() req: any,
    @Param('id') id: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headers, req);
    return this.widgetsService.remove(id, workspaceId);
  }
}
