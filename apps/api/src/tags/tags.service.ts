import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async getGroups(workspaceId: string) {
    return this.prisma.tagGroup.findMany({
      where: { workspaceId },
      include: {
        tags: {
          include: {
            _count: {
              select: { courses: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createGroup(workspaceId: string, data: { name: string; description?: string; selectionMode?: string }) {
    return this.prisma.tagGroup.create({
      data: {
        workspaceId,
        name: data.name,
        description: data.description,
        selectionMode: data.selectionMode || 'SINGLE',
      },
      include: {
        tags: true,
      },
    });
  }

  async updateGroup(id: string, workspaceId: string, data: { name?: string; description?: string; selectionMode?: string }) {
    const group = await this.prisma.tagGroup.findFirst({
      where: { id, workspaceId },
    });
    if (!group) throw new NotFoundException('Tag group not found');

    return this.prisma.tagGroup.update({
      where: { id },
      data,
    });
  }

  async deleteGroup(id: string, workspaceId: string) {
    const group = await this.prisma.tagGroup.findFirst({
      where: { id, workspaceId },
    });
    if (!group) throw new NotFoundException('Tag group not found');

    return this.prisma.tagGroup.delete({
      where: { id },
    });
  }

  async getTags(workspaceId: string, groupId?: string) {
    return this.prisma.tag.findMany({
      where: {
        workspaceId,
        ...(groupId ? { groupId } : {}),
      },
      include: {
        group: true,
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTag(workspaceId: string, data: { name: string; color?: string; description?: string; groupId?: string }) {
    return this.prisma.tag.create({
      data: {
        workspaceId,
        name: data.name,
        color: data.color || '#3b82f6',
        description: data.description,
        groupId: data.groupId,
      },
      include: {
        group: true,
        _count: {
          select: { courses: true },
        },
      },
    });
  }

  async updateTag(id: string, workspaceId: string, data: { name?: string; color?: string; description?: string; groupId?: string }) {
    const tag = await this.prisma.tag.findFirst({
      where: { id, workspaceId },
    });
    if (!tag) throw new NotFoundException('Tag not found');

    return this.prisma.tag.update({
      where: { id },
      data,
      include: {
        group: true,
        _count: {
          select: { courses: true },
        },
      },
    });
  }

  async deleteTag(id: string, workspaceId: string) {
    const tag = await this.prisma.tag.findFirst({
      where: { id, workspaceId },
    });
    if (!tag) throw new NotFoundException('Tag not found');

    // Delete relationships first
    await this.prisma.courseTag.deleteMany({
      where: { tagId: id },
    });

    return this.prisma.tag.delete({
      where: { id },
    });
  }

  async assignTagToCourse(courseId: string, tagId: string) {
    return this.prisma.courseTag.upsert({
      where: {
        courseId_tagId: {
          courseId,
          tagId,
        },
      },
      create: {
        courseId,
        tagId,
      },
      update: {},
    });
  }

  async removeTagFromCourse(courseId: string, tagId: string) {
    return this.prisma.courseTag.deleteMany({
      where: {
        courseId,
        tagId,
      },
    });
  }
}
