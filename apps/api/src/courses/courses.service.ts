import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto & { workspaceId: string, instructorId: string }) {
    return this.prisma.course.create({
      data: {
        title: createCourseDto.title,
        description: createCourseDto.description,
        workspaceId: createCourseDto.workspaceId,
        instructorId: createCourseDto.instructorId,
      },
    });
  }

  async findAll(workspaceId: string) {
    return this.prisma.course.findMany({
      where: { workspaceId },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });
  }

  async findOne(id: string, workspaceId: string) {
    const course = await this.prisma.course.findFirst({
      where: { id, workspaceId },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, workspaceId: string, updateCourseDto: UpdateCourseDto) {
    return this.prisma.course.update({
      where: { id, workspaceId },
      data: updateCourseDto,
    });
  }

  async remove(id: string, workspaceId: string) {
    return this.prisma.course.delete({
      where: { id, workspaceId },
    });
  }
}
