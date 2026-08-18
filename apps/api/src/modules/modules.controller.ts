import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Controller('courses/:courseId/modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  create(@Param('courseId') courseId: string, @Body() createModuleDto: CreateModuleDto) {
    return this.modulesService.create({ ...createModuleDto, courseId });
  }

  @Get()
  findAll(@Param('courseId') courseId: string) {
    return this.modulesService.findAll(courseId);
  }

  @Get(':id')
  findOne(@Param('courseId') courseId: string, @Param('id') id: string) {
    return this.modulesService.findOne(id, courseId);
  }

  @Patch(':id')
  update(@Param('courseId') courseId: string, @Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(id, courseId, updateModuleDto);
  }

  @Patch(':id/reorder')
  reorder(@Param('courseId') courseId: string, @Param('id') id: string, @Body('order') order: number) {
    return this.modulesService.reorder(id, courseId, order);
  }

  @Delete(':id')
  remove(@Param('courseId') courseId: string, @Param('id') id: string) {
    return this.modulesService.remove(id, courseId);
  }
}
