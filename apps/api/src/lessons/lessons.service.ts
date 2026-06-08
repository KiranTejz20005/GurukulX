import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(createLessonDto: CreateLessonDto & { moduleId: string, type: 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' }) {
    // Get highest order for the lesson
    const highestOrderLesson = await this.prisma.lesson.findFirst({
      where: { moduleId: createLessonDto.moduleId },
      orderBy: { order: 'desc' },
    });
    
    const newOrder = highestOrderLesson ? highestOrderLesson.order + 1 : 0;

    return this.prisma.lesson.create({
      data: {
        title: createLessonDto.title,
        moduleId: createLessonDto.moduleId,
        type: createLessonDto.type || 'TEXT',
        order: newOrder,
        content: createLessonDto.content,
        videoUrl: createLessonDto.videoUrl,
      },
    });
  }

  async findAll(moduleId: string) {
    return this.prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string, moduleId: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id, moduleId },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  async update(id: string, moduleId: string, updateLessonDto: UpdateLessonDto) {
    return this.prisma.lesson.update({
      where: { id, moduleId },
      data: updateLessonDto,
    });
  }

  async remove(id: string, moduleId: string) {
    return this.prisma.lesson.delete({
      where: { id, moduleId },
    });
  }
}
