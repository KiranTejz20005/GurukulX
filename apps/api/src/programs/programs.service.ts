import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  async findAll(workspaceId?: string) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    return this.prisma.program.findMany({
      where: { workspaceId: wsId },
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
                thumbnail: true,
                published: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, workspaceId?: string) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    let program = await this.prisma.program.findFirst({
      where: { id, workspaceId: wsId },
      include: {
        courses: {
          include: {
            course: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!program) {
      program = await this.prisma.program.findUnique({
        where: { id },
        include: {
          courses: {
            include: {
              course: true,
            },
            orderBy: { order: 'asc' },
          },
        },
      });
    }

    if (!program) throw new NotFoundException(`Program not found`);
    return program;
  }

  async create(workspaceId: string, data: { title: string; description?: string; courseIds?: string[]; published?: boolean }) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    const program = await this.prisma.program.create({
      data: {
        workspaceId: wsId,
        title: data.title,
        description: data.description,
        published: data.published ?? true,
      },
    });

    if (data.courseIds && data.courseIds.length > 0) {
      await this.prisma.programCourse.createMany({
        data: data.courseIds.map((courseId, index) => ({
          programId: program.id,
          courseId,
          order: index + 1,
        })),
      });
    }

    return this.findOne(program.id, wsId);
  }

  async update(
    id: string,
    workspaceId: string,
    data: { title?: string; description?: string; courseIds?: string[]; published?: boolean },
  ) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    await this.findOne(id, wsId);

    await this.prisma.program.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
      },
    });

    if (data.courseIds) {
      await this.prisma.programCourse.deleteMany({
        where: { programId: id },
      });
      if (data.courseIds.length > 0) {
        await this.prisma.programCourse.createMany({
          data: data.courseIds.map((courseId, index) => ({
            programId: id,
            courseId,
            order: index + 1,
          })),
        });
      }
    }

    return this.findOne(id, wsId);
  }

  async remove(id: string, workspaceId: string) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    await this.findOne(id, wsId);

    await this.prisma.programCourse.deleteMany({ where: { programId: id } });
    return this.prisma.program.delete({ where: { id } });
  }
}
