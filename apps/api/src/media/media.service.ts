import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async findAll(workspaceId: string, type?: string) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    const where: any = { workspaceId: wsId };
    if (type && type !== 'all') {
      where.mimeType = { startsWith: type };
    }

    return this.prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStorageStats(workspaceId: string) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    const items = await this.prisma.media.findMany({
      where: { workspaceId: wsId },
      select: { size: true, mimeType: true },
    });

    const totalBytes = items.reduce((acc, curr) => acc + (curr.size || 0), 0);
    const count = items.length;

    const breakdown = {
      image: 0,
      video: 0,
      document: 0,
      other: 0,
    };

    items.forEach((item) => {
      const mime = item.mimeType || '';
      if (mime.startsWith('image/')) breakdown.image += item.size || 0;
      else if (mime.startsWith('video/')) breakdown.video += item.size || 0;
      else if (mime.includes('pdf') || mime.includes('document') || mime.includes('text')) breakdown.document += item.size || 0;
      else breakdown.other += item.size || 0;
    });

    return {
      totalBytes,
      count,
      breakdown,
      limitBytes: 5 * 1024 * 1024 * 1024, // 5 GB default workspace limit
    };
  }

  async create(workspaceId: string, data: { filename: string; url: string; mimeType: string; size: number }) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    return this.prisma.media.create({
      data: {
        workspaceId: wsId,
        filename: data.filename,
        url: data.url,
        mimeType: data.mimeType,
        size: data.size,
      },
    });
  }

  async findOne(id: string, workspaceId: string) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    let item = await this.prisma.media.findFirst({
      where: { id, workspaceId: wsId },
    });
    if (!item) {
      item = await this.prisma.media.findUnique({ where: { id } });
    }
    if (!item) throw new NotFoundException('Media item not found');
    return item;
  }

  async remove(id: string, workspaceId: string) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    await this.findOne(id, wsId);
    return this.prisma.media.delete({
      where: { id },
    });
  }
}
