import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(data: { name: string; slug: string; customDomain?: string; branding?: string }) {
    return this.prisma.workspace.create({
      data: { name: data.name, slug: data.slug, customDomain: data.customDomain, branding: data.branding },
    });
  }

  async findAll() {
    return this.prisma.workspace.findMany({
      include: {
        _count: { select: { members: true, courses: true, forums: true } },
      },
    });
  }

  async findOne(id: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: { members: { include: { user: true } }, courses: true },
    });
    if (!workspace) throw new NotFoundException(`Workspace with ID ${id} not found`);
    return workspace;
  }

  async update(id: string, data: { name?: string; slug?: string; customDomain?: string; branding?: string }) {
    await this.findOne(id);
    return this.prisma.workspace.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.workspace.delete({ where: { id } });
  }

  async addMember(workspaceId: string, userId: string, role: string = 'STUDENT') {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const member = await this.prisma.workspaceMember.create({
      data: { workspaceId, userId, role },
      include: { user: true },
    });

    // Fire MEMBER_JOINED notification
    await this.notifications.create({
      workspaceId,
      type: 'MEMBER_JOINED',
      title: 'New Member Joined',
      message: `${user?.name || user?.email || 'A new user'} joined the workspace as ${role}.`,
      link: `/audience`,
      actorName: user?.name || undefined,
      actorEmail: user?.email,
    });

    return member;
  }

  async getSetupProgress(workspaceId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        courses: {
          include: {
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
        members: true,
      },
    });

    if (!workspace) {
      return {
        completedCount: 1,
        totalCount: 6,
        percentage: 17,
        workspace: { id: workspaceId, name: "GurukulX", slug: "st-peters" },
      };
    }

    const hasProfile = true; // logged in
    const hasOrg = Boolean(workspace.name && workspace.slug);
    const hasCourse = workspace.courses.length > 0;
    
    let hasLesson = false;
    let hasExercise = false;
    let hasPublished = false;

    for (const c of workspace.courses) {
      if (c.published) hasPublished = true;
      for (const m of c.modules) {
        if (m.lessons && m.lessons.length > 0) {
          hasLesson = true;
          if (m.lessons.some((l) => l.type === 'QUIZ')) {
            hasExercise = true;
          }
        }
      }
    }

    const steps = [
      { id: 'profile', completed: hasProfile },
      { id: 'org', completed: hasOrg },
      { id: 'course', completed: hasCourse },
      { id: 'lesson', completed: hasLesson },
      { id: 'exercise', completed: hasExercise },
      { id: 'publish', completed: hasPublished },
    ];

    const completedCount = steps.filter((s) => s.completed).length;
    const totalCount = steps.length;
    const percentage = Math.round((completedCount / totalCount) * 100);

    return {
      completedCount,
      totalCount,
      percentage,
      steps,
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        customDomain: workspace.customDomain,
      },
    };
  }
}
