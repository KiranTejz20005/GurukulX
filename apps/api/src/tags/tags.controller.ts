import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers, Request } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  private resolveWorkspaceId(headers: Record<string, string>, req: any): string {
    return headers['x-workspace-id'] || req.user?.workspaceId || 'dev-workspace-123';
  }

  // Tag Groups
  @Get('groups')
  async getGroups(@Headers() headers: Record<string, string>, @Request() req: any) {
    const workspaceId = this.resolveWorkspaceId(headers, req);
    return this.tagsService.getGroups(workspaceId);
  }

  @Post('groups')
  async createGroup(
    @Headers() headers: Record<string, string>,
    @Request() req: any,
    @Body() body: { name: string; description?: string; selectionMode?: string },
  ) {
    const workspaceId = this.resolveWorkspaceId(headers, req);
    return this.tagsService.createGroup(workspaceId, body);
  }

  @Put('groups/:id')
  async updateGroup(
    @Headers() headers: Record<string, string>,
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; selectionMode?: string },
  ) {
    const workspaceId = this.resolveWorkspaceId(headers, req);
    return this.tagsService.updateGroup(id, workspaceId, body);
  }

  @Delete('groups/:id')
  async deleteGroup(
    @Headers() headers: Record<string, string>,
    @Request() req: any,
    @Param('id') id: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headers, req);
    return this.tagsService.deleteGroup(id, workspaceId);
  }

  // Tags
  @Get()
  async getTags(
    @Headers() headers: Record<string, string>,
    @Request() req: any,
    @Query('groupId') groupId?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headers, req);
    return this.tagsService.getTags(workspaceId, groupId);
  }

  @Post()
  async createTag(
    @Headers() headers: Record<string, string>,
    @Request() req: any,
    @Body() body: { name: string; color?: string; description?: string; groupId?: string },
  ) {
    const workspaceId = this.resolveWorkspaceId(headers, req);
    return this.tagsService.createTag(workspaceId, body);
  }

  @Put(':id')
  async updateTag(
    @Headers() headers: Record<string, string>,
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { name?: string; color?: string; description?: string; groupId?: string },
  ) {
    const workspaceId = this.resolveWorkspaceId(headers, req);
    return this.tagsService.updateTag(id, workspaceId, body);
  }

  @Delete(':id')
  async deleteTag(
    @Headers() headers: Record<string, string>,
    @Request() req: any,
    @Param('id') id: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headers, req);
    return this.tagsService.deleteTag(id, workspaceId);
  }

  // Course Tagging
  @Post('courses/:courseId/tags/:tagId')
  async assignTag(
    @Param('courseId') courseId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.tagsService.assignTagToCourse(courseId, tagId);
  }

  @Delete('courses/:courseId/tags/:tagId')
  async removeTag(
    @Param('courseId') courseId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.tagsService.removeTagFromCourse(courseId, tagId);
  }
}
