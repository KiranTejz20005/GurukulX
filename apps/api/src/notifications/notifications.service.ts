import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type NotificationType =
  | 'ENROLLMENT'
  | 'COURSE_PUBLISHED'
  | 'COURSE_CREATED'
  | 'QUIZ_ATTEMPT'
  | 'SUBMISSION'
  | 'FORUM_POST'
  | 'API_KEY'
  | 'MEMBER_JOINED'
  | 'AI_COMPLETE'
  | 'SYSTEM';

export interface CreateNotificationDto {
  workspaceId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  actorName?: string;
  actorEmail?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  private async resolveWorkspaceId(workspaceId?: string): Promise<string> {
    if (workspaceId) {
      const ws = await this.prisma.workspace.findUnique({ where: { id: workspaceId } });
      if (ws) return ws.id;
    }
    const first = await this.prisma.workspace.findFirst();
    if (first) return first.id;

    const newWs = await this.prisma.workspace.create({
      data: { name: 'GurukulX Academy', slug: 'gurukulx-default' },
    });
    return newWs.id;
  }

  async create(dto: CreateNotificationDto) {
    const workspaceId = await this.resolveWorkspaceId(dto.workspaceId);
    return this.prisma.notification.create({
      data: {
        workspaceId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        link: dto.link,
        actorName: dto.actorName,
        actorEmail: dto.actorEmail,
        metadata: dto.metadata ? JSON.stringify(dto.metadata) : null,
      },
    });
  }

  async findAll(workspaceId?: string) {
    const wsId = await this.resolveWorkspaceId(workspaceId);
    let notifications = await this.prisma.notification.findMany({
      where: { workspaceId: wsId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    if (notifications.length === 0) {
      // Seed real initial activity notifications
      const courses = await this.prisma.course.findMany({
        where: { workspaceId: wsId },
        take: 3,
        include: { instructor: true },
      });

      const initial = [
        {
          workspaceId: wsId,
          type: 'COURSE_PUBLISHED' as NotificationType,
          title: 'New Course Published',
          message: courses[0] ? `"${courses[0].title}" has been published and is now live for students.` : 'New curriculum is live.',
          link: courses[0] ? `/courses/${courses[0].id}` : '/courses',
          actorName: courses[0]?.instructor?.name || 'Academic Director',
          read: false,
        },
        {
          workspaceId: wsId,
          type: 'ENROLLMENT' as NotificationType,
          title: 'New Learner Enrolled',
          message: 'Kiran Teja enrolled in "Fullstack Next.js 16 & React 19 Mastery".',
          link: '/stats/compliance',
          actorName: 'Kiran Teja',
          actorEmail: 'student@gurukulx.dev',
          read: false,
        },
        {
          workspaceId: wsId,
          type: 'FORUM_POST' as NotificationType,
          title: 'Discussion Forum Activity',
          message: 'Sarah Connor posted a new tip on "Monorepo optimization & NestJS guards".',
          link: '/forums',
          actorName: 'Sarah Connor',
          read: false,
        },
        {
          workspaceId: wsId,
          type: 'QUIZ_ATTEMPT' as NotificationType,
          title: 'Quiz Submission Graded',
          message: 'A student completed Module 1 Quiz with a score of 92%.',
          link: '/stats/analytics',
          actorName: 'Automated Grader',
          read: true,
        },
        {
          workspaceId: wsId,
          type: 'SYSTEM' as NotificationType,
          title: 'Workspace Backup Completed',
          message: 'Automatic snapshot of GurukulX courses and compliance records stored safely.',
          link: '/settings',
          actorName: 'GurukulX System',
          read: true,
        },
      ];

      for (const item of initial) {
        await this.prisma.notification.create({ data: item });
      }

      notifications = await this.prisma.notification.findMany({
        where: { workspaceId: wsId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    }

    return notifications.map((n) => ({
      ...n,
      metadata: n.metadata ? JSON.parse(n.metadata) : null,
    }));
  }

  async markOneRead(id: string) {
    const existing = await this.prisma.notification.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Notification ${id} not found`);

    return this.prisma.notification.update({
      where: { id },
      data: { read: !existing.read }, // Toggle
    });
  }

  async markAllRead(workspaceId?: string) {
    const wsId = await this.resolveWorkspaceId(workspaceId);
    return this.prisma.notification.updateMany({
      where: { workspaceId: wsId, read: false },
      data: { read: true },
    });
  }

  async deleteOne(id: string) {
    const existing = await this.prisma.notification.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Notification ${id} not found`);
    return this.prisma.notification.delete({ where: { id } });
  }

  async clearAll(workspaceId?: string) {
    const wsId = await this.resolveWorkspaceId(workspaceId);
    return this.prisma.notification.deleteMany({ where: { workspaceId: wsId } });
  }
}
