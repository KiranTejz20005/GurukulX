import { Controller, Get, Post, Delete, Body, Param, Headers } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';

@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Get()
  findAll(@Headers('x-workspace-id') workspaceId?: string) {
    return this.apiKeysService.findAll(workspaceId);
  }

  @Post()
  create(@Body() body: { name: string }, @Headers('x-workspace-id') workspaceId?: string) {
    return this.apiKeysService.create(workspaceId || 'dev-workspace-123', body.name);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('x-workspace-id') workspaceId?: string) {
    return this.apiKeysService.remove(id, workspaceId);
  }
}
