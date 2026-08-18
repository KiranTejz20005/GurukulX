import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  private async ensureWorkspaceAndUser(workspaceId?: string, instructorId?: string) {
    let resolvedWorkspaceId = workspaceId;
    let resolvedInstructorId = instructorId;

    if (resolvedWorkspaceId) {
      const existingWs = await this.prisma.workspace.findUnique({
        where: { id: resolvedWorkspaceId },
      });
      if (!existingWs) {
        const firstWs = await this.prisma.workspace.findFirst();
        if (firstWs) {
          resolvedWorkspaceId = firstWs.id;
        } else {
          const newWs = await this.prisma.workspace.create({
            data: {
              name: 'GurukulX Academy',
              slug: 'gurukulx-default',
            },
          });
          resolvedWorkspaceId = newWs.id;
        }
      }
    } else {
      const firstWs = await this.prisma.workspace.findFirst();
      if (firstWs) {
        resolvedWorkspaceId = firstWs.id;
      } else {
        const newWs = await this.prisma.workspace.create({
          data: {
            name: 'GurukulX Academy',
            slug: 'gurukulx-default',
          },
        });
        resolvedWorkspaceId = newWs.id;
      }
    }

    if (resolvedInstructorId) {
      const existingUser = await this.prisma.user.findUnique({
        where: { id: resolvedInstructorId },
      });
      if (!existingUser) {
        const firstUser = await this.prisma.user.findFirst();
        if (firstUser) {
          resolvedInstructorId = firstUser.id;
        } else {
          const newUser = await this.prisma.user.create({
            data: {
              email: 'instructor@gurukulx.dev',
              name: 'GurukulX Instructor',
            },
          });
          resolvedInstructorId = newUser.id;
        }
      }
    } else {
      const firstUser = await this.prisma.user.findFirst();
      if (firstUser) {
        resolvedInstructorId = firstUser.id;
      } else {
        const newUser = await this.prisma.user.create({
          data: {
            email: 'instructor@gurukulx.dev',
            name: 'GurukulX Instructor',
          },
        });
        resolvedInstructorId = newUser.id;
      }
    }

    return { workspaceId: resolvedWorkspaceId, instructorId: resolvedInstructorId };
  }

  async create(createCourseDto: CreateCourseDto & { workspaceId?: string, instructorId?: string }) {
    const { workspaceId, instructorId } = await this.ensureWorkspaceAndUser(
      createCourseDto.workspaceId,
      createCourseDto.instructorId,
    );

    return this.prisma.course.create({
      data: {
        title: createCourseDto.title || 'Untitled Course',
        description: createCourseDto.description || '',
        workspaceId,
        instructorId,
      },
    });
  }

  private slugify(text: string): string {
    return (text || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async findAll(workspaceId?: string) {
    const { workspaceId: resolvedWorkspaceId } = await this.ensureWorkspaceAndUser(workspaceId);

    const courses = await this.prisma.course.findMany({
      where: { workspaceId: resolvedWorkspaceId },
      include: {
        modules: {
          include: {
            lessons: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return courses.map((course) => ({
      ...course,
      slug: this.slugify(course.title) || course.id,
    }));
  }

  async findOne(idOrSlug: string, workspaceId?: string) {
    let course = await this.prisma.course.findFirst({
      where: { id: idOrSlug },
      include: {
        modules: {
          include: {
            lessons: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!course) {
      const allCourses = await this.prisma.course.findMany({
        include: {
          modules: {
            include: {
              lessons: true,
            },
            orderBy: { order: 'asc' },
          },
        },
      });

      course = allCourses.find(
        (c) => this.slugify(c.title) === idOrSlug.toLowerCase() || c.id === idOrSlug
      ) || null;
    }

    if (!course) {
      throw new NotFoundException(`Course with ID or Slug "${idOrSlug}" not found`);
    }

    return {
      ...course,
      slug: this.slugify(course.title) || course.id,
    };
  }

  async update(id: string, workspaceId: string, updateCourseDto: UpdateCourseDto) {
    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
    });
  }

  async remove(id: string, workspaceId: string) {
    return this.prisma.course.delete({
      where: { id },
    });
  }
}

