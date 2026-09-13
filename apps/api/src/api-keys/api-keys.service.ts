import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async findAll(workspaceId?: string) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    return this.prisma.apiKey.findMany({
      where: { workspaceId: wsId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(workspaceId: string, name: string) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    const key = `gk_live_${randomBytes(20).toString('hex')}`;

    const apiKey = await this.prisma.apiKey.create({
      data: {
        workspaceId: wsId,
        name: name || 'Production API Key',
        key,
        lastUsedAt: new Date(),
      },
    });

    // Fire API_KEY notification
    await this.notifications.create({
      workspaceId: wsId,
      type: 'API_KEY',
      title: 'New API Key Created',
      message: `API Key "${apiKey.name}" was generated. Keep this token secret.`,
      link: '/api-settings',
    });

    return apiKey;
  }

  async remove(id: string, workspaceId?: string) {
    const wsId = await this.prisma.resolveWorkspaceId(workspaceId);
    const existing = await this.prisma.apiKey.findFirst({
      where: { id, workspaceId: wsId },
    });

    if (!existing) {
      const fallback = await this.prisma.apiKey.findUnique({ where: { id } });
      if (!fallback) throw new NotFoundException(`API key with ID ${id} not found`);
      return this.prisma.apiKey.delete({ where: { id } });
    }

    const deleted = await this.prisma.apiKey.delete({ where: { id } });

    await this.notifications.create({
      workspaceId: wsId,
      type: 'API_KEY',
      title: 'API Key Revoked',
      message: `API Key "${deleted.name}" was revoked and can no longer be used.`,
      link: '/api-settings',
    });

    return deleted;
  }
}
