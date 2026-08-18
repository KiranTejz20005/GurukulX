import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ForumsService {
  constructor(private prisma: PrismaService) {}

  async findAll(workspaceId: string) {
    return this.prisma.forum.findMany({
      where: { workspaceId },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const forum = await this.prisma.forum.findUnique({
      where: { id },
      include: {
        posts: {
          include: {
            user: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!forum) {
      throw new NotFoundException(`Forum with ID ${id} not found`);
    }

    return forum;
  }

  async createPost(data: { forumId: string; userId: string; content: string }) {
    return this.prisma.forumPost.create({
      data: {
        forumId: data.forumId,
        userId: data.userId,
        content: data.content,
      },
      include: {
        user: true,
      },
    });
  }

  async deletePost(id: string) {
    return this.prisma.forumPost.delete({
      where: { id },
    });
  }
}
