import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ForumsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async findAll(workspaceId?: string) {
    return this.prisma.forum.findMany({
      where: workspaceId ? { workspaceId } : undefined,
      include: {
        posts: {
          include: { user: true },
          orderBy: { createdAt: 'desc' }
        },
        _count: { select: { posts: true } },
      },
      orderBy: { id: 'desc' }
    });
  }

  async createForum(data: { workspaceId: string; title: string; description?: string }) {
    return this.prisma.forum.create({
      data: {
        workspaceId: data.workspaceId,
        title: data.title,
        description: data.description,
      },
      include: {
        posts: true,
        _count: { select: { posts: true } }
      }
    });
  }

  async findOne(id: string) {
    const forum = await this.prisma.forum.findUnique({
      where: { id },
      include: {
        posts: {
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!forum) throw new NotFoundException(`Forum with ID ${id} not found`);
    return forum;
  }

  async createPost(data: { forumId: string; userId: string; content: string; workspaceId?: string }) {
    const post = await this.prisma.forumPost.create({
      data: { forumId: data.forumId, userId: data.userId, content: data.content },
      include: { user: true, forum: true },
    });

    // Resolve workspace for notification
    const wsId = data.workspaceId || post.forum.workspaceId;
    await this.notifications.create({
      workspaceId: wsId,
      type: 'FORUM_POST',
      title: 'New Community Discussion Post',
      message: `${post.user.name || post.user.email} posted in "${post.forum.title}": "${post.content.slice(0, 60)}${post.content.length > 60 ? '…' : ''}"`,
      link: `/community`,
      actorName: post.user.name || undefined,
      actorEmail: post.user.email,
    });

    return post;
  }

  async deletePost(id: string) {
    return this.prisma.forumPost.delete({ where: { id } });
  }
}
