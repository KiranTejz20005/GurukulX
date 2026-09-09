import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async findAll(workspaceId: string, type?: string) {
    const where: any = { workspaceId };
    if (type && type !== 'all') {
      where.mimeType = { startsWith: type };
    }

    const items = await this.prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return items;
  }

  async getStorageStats(workspaceId: string) {
    const items = await this.prisma.media.findMany({
      where: { workspaceId },
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
    return this.prisma.media.create({
      data: {
        workspaceId,
        filename: data.filename,
        url: data.url,
        mimeType: data.mimeType,
        size: data.size,
      },
    });
  }

  async findOne(id: string, workspaceId: string) {
    const item = await this.prisma.media.findFirst({
      where: { id, workspaceId },
    });
    if (!item) throw new NotFoundException('Media item not found');
    return item;
  }

  async remove(id: string, workspaceId: string) {
    const item = await this.prisma.media.findFirst({
      where: { id, workspaceId },
    });
    if (!item) throw new NotFoundException('Media item not found');

    return this.prisma.media.delete({
      where: { id },
    });
  }
}
