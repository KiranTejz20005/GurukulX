import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto, @Headers('x-workspace-id') workspaceId: string, @Headers('x-user-id') instructorId: string) {
    return this.coursesService.create({ ...createCourseDto, workspaceId, instructorId });
  }

  @Get()
  findAll(@Headers('x-workspace-id') workspaceId: string) {
    return this.coursesService.findAll(workspaceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('x-workspace-id') workspaceId: string) {
    return this.coursesService.findOne(id, workspaceId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto, @Headers('x-workspace-id') workspaceId: string) {
    return this.coursesService.update(id, workspaceId, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('x-workspace-id') workspaceId: string) {
    return this.coursesService.remove(id, workspaceId);
  }
}
