import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async create(createModuleDto: CreateModuleDto & { courseId: string }) {
    // Get highest order for the module
    const highestOrderModule = await this.prisma.module.findFirst({
      where: { courseId: createModuleDto.courseId },
      orderBy: { order: 'desc' },
    });
    
    const newOrder = highestOrderModule ? highestOrderModule.order + 1 : 0;

    return this.prisma.module.create({
      data: {
        title: createModuleDto.title,
        courseId: createModuleDto.courseId,
        order: newOrder,
      },
    });
  }

  async findAll(courseId: string) {
    return this.prisma.module.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        lessons: true,
      },
    });
  }

  async findOne(id: string, courseId: string) {
    const moduleItem = await this.prisma.module.findFirst({
      where: { id, courseId },
      include: {
        lessons: true,
      },
    });

    if (!moduleItem) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    return moduleItem;
  }

  async update(id: string, courseId: string, updateModuleDto: UpdateModuleDto) {
    return this.prisma.module.update({
      where: { id, courseId },
      data: updateModuleDto,
    });
  }

  async remove(id: string, courseId: string) {
    return this.prisma.module.delete({
      where: { id, courseId },
    });
  }
}
