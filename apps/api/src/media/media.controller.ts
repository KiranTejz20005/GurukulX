import { Controller, Get, Post, Delete, Body, Param, Query, Headers, Request } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  private resolveWorkspaceId(headers: Record<string, string>, req: any): string {
    return headers['x-workspace-id'] || req.user?.workspaceId || 'dev-workspace-123';
  }

  @Get()
  findAll(
    @Headers() headers: Record<string, string>,
    @Request() req: any,
    @Query('type') type?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headers, req);
    return this.mediaService.findAll(workspaceId, type);
  }

  @Get('storage')
  getStorage(
    @Headers() headers: Record<string, string>,
    @Request() req: any,
  ) {
    const workspaceId = this.resolveWorkspaceId(headers, req);
    return this.mediaService.getStorageStats(workspaceId);
  }

  @Post()
  create(
    @Headers() headers: Record<string, string>,
    @Request() req: any,
    @Body() body: { filename: string; url: string; mimeType: string; size: number },
  ) {
    const workspaceId = this.resolveWorkspaceId(headers, req);
    return this.mediaService.create(workspaceId, body);
  }

  @Get(':id')
  findOne(
    @Headers() headers: Record<string, string>,
    @Request() req: any,
    @Param('id') id: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headers, req);
    return this.mediaService.findOne(id, workspaceId);
  }

  @Delete(':id')
  remove(
    @Headers() headers: Record<string, string>,
    @Request() req: any,
    @Param('id') id: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headers, req);
    return this.mediaService.remove(id, workspaceId);
  }
}
