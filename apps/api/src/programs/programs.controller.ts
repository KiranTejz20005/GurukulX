import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { ProgramsService } from './programs.service';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post()
  create(
    @Body() createProgramDto: { title: string; description?: string; courseIds?: string[]; published?: boolean },
    @Headers('x-workspace-id') workspaceId?: string,
  ) {
    return this.programsService.create(workspaceId || 'dev-workspace-123', createProgramDto);
  }

  @Get()
  findAll(@Headers('x-workspace-id') workspaceId?: string) {
    return this.programsService.findAll(workspaceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('x-workspace-id') workspaceId?: string) {
    return this.programsService.findOne(id, workspaceId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProgramDto: { title?: string; description?: string; courseIds?: string[]; published?: boolean },
    @Headers('x-workspace-id') workspaceId?: string,
  ) {
    return this.programsService.update(id, workspaceId || 'dev-workspace-123', updateProgramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('x-workspace-id') workspaceId?: string) {
    return this.programsService.remove(id, workspaceId || 'dev-workspace-123');
  }
}
