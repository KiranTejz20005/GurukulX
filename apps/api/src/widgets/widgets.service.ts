import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WidgetsService {
  constructor(private prisma: PrismaService) {}

  async findAll(workspaceId: string) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    return this.prisma.widget.findMany({
      where: { workspaceId: wsId },
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
                type: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, workspaceId: string) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    let widget = await this.prisma.widget.findFirst({
      where: { id, workspaceId: wsId },
      include: {
        courses: {
          include: {
            course: true,
          },
          orderBy: { order: 'asc' },
        },
        versions: {
          orderBy: { version: 'desc' },
          take: 5,
        },
      },
    });

    if (!widget) {
      widget = await this.prisma.widget.findUnique({
        where: { id },
        include: {
          courses: {
            include: {
              course: true,
            },
            orderBy: { order: 'asc' },
          },
          versions: {
            orderBy: { version: 'desc' },
            take: 5,
          },
        },
      });
    }

    if (!widget) throw new NotFoundException('Widget not found');
    return widget;
  }

  async create(
    workspaceId: string,
    data: { name: string; theme?: string; layout?: string; primaryColor?: string; courseIds?: string[] },
  ) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    const widget = await this.prisma.widget.create({
      data: {
        workspaceId: wsId,
        name: data.name,
        theme: data.theme || 'dark',
        layout: data.layout || 'grid',
        primaryColor: data.primaryColor || '#3b82f6',
      },
    });

    if (data.courseIds && data.courseIds.length > 0) {
      await this.prisma.widgetCourse.createMany({
        data: data.courseIds.map((courseId, index) => ({
          widgetId: widget.id,
          courseId,
          order: index,
        })),
      });
    }

    // Create initial version
    await this.prisma.widgetVersion.create({
      data: {
        widgetId: widget.id,
        version: 1,
        config: JSON.stringify({
          name: widget.name,
          theme: widget.theme,
          layout: widget.layout,
          primaryColor: widget.primaryColor,
          courses: data.courseIds || [],
        }),
      },
    });

    return this.findOne(widget.id, wsId);
  }

  async update(
    id: string,
    workspaceId: string,
    data: { name?: string; theme?: string; layout?: string; primaryColor?: string; courseIds?: string[] },
  ) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    await this.findOne(id, wsId);

    await this.prisma.widget.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.theme ? { theme: data.theme } : {}),
        ...(data.layout ? { layout: data.layout } : {}),
        ...(data.primaryColor ? { primaryColor: data.primaryColor } : {}),
      },
    });

    if (data.courseIds) {
      await this.prisma.widgetCourse.deleteMany({
        where: { widgetId: id },
      });
      if (data.courseIds.length > 0) {
        await this.prisma.widgetCourse.createMany({
          data: data.courseIds.map((courseId, index) => ({
            widgetId: id,
            courseId,
            order: index,
          })),
        });
      }
    }

    // Add new snapshot version
    const latestVersion = await this.prisma.widgetVersion.findFirst({
      where: { widgetId: id },
      orderBy: { version: 'desc' },
    });
    const nextVer = (latestVersion?.version || 1) + 1;

    await this.prisma.widgetVersion.create({
      data: {
        widgetId: id,
        version: nextVer,
        config: JSON.stringify(data),
      },
    });

    return this.findOne(id, wsId);
  }

  async remove(id: string, workspaceId: string) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    await this.findOne(id, wsId);
    return this.prisma.widget.delete({
      where: { id },
    });
  }

  // Public embed endpoint payload
  async getPublicEmbed(id: string) {
    const widget = await this.prisma.widget.findUnique({
      where: { id },
      include: {
        workspace: {
          select: { id: true, name: true, slug: true },
        },
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
                thumbnail: true,
                type: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!widget) throw new NotFoundException('Widget not found');

    return {
      id: widget.id,
      name: widget.name,
      theme: widget.theme,
      layout: widget.layout,
      primaryColor: widget.primaryColor,
      organization: widget.workspace.name,
      courses: widget.courses.map((wc) => wc.course),
    };
  }
}
