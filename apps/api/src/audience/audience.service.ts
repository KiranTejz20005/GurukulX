import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AudienceService {
  constructor(private prisma: PrismaService) {}

  async getMembers(workspaceId: string, search?: string, role?: string) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    const members = await this.prisma.workspaceMember.findMany({
      where: {
        workspaceId: wsId,
        ...(role ? { role } : {}),
        ...(search
          ? {
              user: {
                OR: [
                  { name: { contains: search } },
                  { email: { contains: search } },
                ],
              },
            }
          : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            enrollments: {
              where: { course: { workspaceId: wsId } },
              select: { id: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return members.map((m) => ({
      id: m.id,
      role: m.role,
      joinedAt: m.createdAt,
      user: {
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        createdAt: m.user.createdAt,
        courseCount: m.user.enrollments.length,
      },
    }));
  }

  async inviteMember(workspaceId: string, email: string, role: string) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const existing = await this.prisma.workspaceInvite.findFirst({
      where: { workspaceId: wsId, email, status: 'PENDING' },
    });

    if (existing) {
      return this.prisma.workspaceInvite.update({
        where: { id: existing.id },
        data: { token, expiresAt },
      });
    }

    return this.prisma.workspaceInvite.create({
      data: { workspaceId: wsId, email, role, token, expiresAt, status: 'PENDING' },
    });
  }

  async getPendingInvites(workspaceId: string) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    return this.prisma.workspaceInvite.findMany({
      where: { workspaceId: wsId, status: 'PENDING', expiresAt: { gte: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revokeInvite(inviteId: string) {
    return this.prisma.workspaceInvite.update({
      where: { id: inviteId },
      data: { status: 'REVOKED' },
    });
  }

  async resetStudentProgress(courseId: string, userId: string) {
    // Get all lessons for this course
    const lessons = await this.prisma.lesson.findMany({
      where: { module: { courseId } },
      select: { id: true },
    });
    const lessonIds = lessons.map((l) => l.id);

    // Delete lesson progress records (Progress model)
    await this.prisma.progress.deleteMany({
      where: { userId, lessonId: { in: lessonIds } },
    });

    // Reset enrollment progress
    await this.prisma.enrollment.updateMany({
      where: { courseId, userId },
      data: { progress: 0, completedAt: null },
    });

    return { success: true, message: 'Student progress has been reset' };
  }

  async removeMember(workspaceId: string, userId: string) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    const member = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId: wsId, userId },
    });
    if (!member) throw new NotFoundException('Member not found');
    await this.prisma.workspaceMember.delete({ where: { id: member.id } });
    return { success: true };
  }

  async updateMemberRole(workspaceId: string, userId: string, role: string) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    const member = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId: wsId, userId },
    });
    if (!member) throw new NotFoundException('Member not found');
    return this.prisma.workspaceMember.update({
      where: { id: member.id },
      data: { role },
    });
  }
}
