import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; slug: string; customDomain?: string; branding?: string }) {
    return this.prisma.workspace.create({
      data: {
        name: data.name,
        slug: data.slug,
        customDomain: data.customDomain,
        branding: data.branding,
      },
    });
  }

  async findAll() {
    return this.prisma.workspace.findMany({
      include: {
        _count: {
          select: {
            members: true,
            courses: true,
            forums: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        courses: true,
      },
    });
    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }
    return workspace;
  }

  async update(id: string, data: { name?: string; slug?: string; customDomain?: string; branding?: string }) {
    await this.findOne(id);
    return this.prisma.workspace.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.workspace.delete({
      where: { id },
    });
  }
}
