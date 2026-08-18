import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller('modules/:moduleId/lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  create(@Param('moduleId') moduleId: string, @Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create({ ...createLessonDto, moduleId, type: 'TEXT' });
  }

  @Get()
  findAll(@Param('moduleId') moduleId: string) {
    return this.lessonsService.findAll(moduleId);
  }

  @Get(':id')
  findOne(@Param('moduleId') moduleId: string, @Param('id') id: string) {
    return this.lessonsService.findOne(id, moduleId);
  }

  @Patch(':id')
  update(@Param('moduleId') moduleId: string, @Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, moduleId, updateLessonDto);
  }

  @Delete(':id')
  remove(@Param('moduleId') moduleId: string, @Param('id') id: string) {
    return this.lessonsService.remove(id, moduleId);
  }

  @Post(':id/quiz/submit')
  submitQuiz(
    @Param('id') lessonId: string,
    @Body() body: { userId: string; answers: Record<string, string> }
  ) {
    return this.lessonsService.submitQuiz(lessonId, body.userId || 'demo-user', body.answers || {});
  }

  @Post(':id/progress')
  markProgress(
    @Param('id') lessonId: string,
    @Body() body: { userId: string; completed: boolean }
  ) {
    return this.lessonsService.markProgress(lessonId, body.userId || 'demo-user', body.completed ?? true);
  }
}
