import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  create(@Body() createWorkspaceDto: { name: string; slug: string; customDomain?: string; branding?: string }) {
    return this.workspacesService.create(createWorkspaceDto);
  }

  @Get()
  findAll() {
    return this.workspacesService.findAll();
  }

  @Get('setup-progress')
  getSetupProgress(@Param('workspaceId') wsParam: string, @Headers() headers: Record<string, string>) {
    const wsId = headers['x-workspace-id'] || 'dev-workspace-123';
    return this.workspacesService.getSetupProgress(wsId);
  }

  @Get('current')
  async getCurrent(@Headers() headers: Record<string, string>) {
    const wsId = headers['x-workspace-id'] || 'dev-workspace-123';
    return this.workspacesService.findOne(wsId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workspacesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkspaceDto: { name?: string; slug?: string; customDomain?: string; branding?: string }) {
    return this.workspacesService.update(id, updateWorkspaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspacesService.remove(id);
  }
}
