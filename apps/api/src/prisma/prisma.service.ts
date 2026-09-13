import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async resolveWorkspaceId(workspaceId?: string): Promise<string> {
    if (workspaceId) {
      const ws = await this.workspace.findUnique({ where: { id: workspaceId } });
      if (ws) return ws.id;
    }
    const first = await this.workspace.findFirst();
    if (first) return first.id;

    const newWs = await this.workspace.create({
      data: { id: 'dev-workspace-123', name: 'GurukulX Academy', slug: 'gurukulx' },
    });
    return newWs.id;
  }

  async resolveUserId(userId?: string): Promise<string> {
    if (userId) {
      const user = await this.user.findUnique({ where: { id: userId } });
      if (user) return user.id;
    }
    const first = await this.user.findFirst();
    if (first) return first.id;

    const newUser = await this.user.create({
      data: { id: 'dev-user-123', email: 'admin@gurukulx.dev', name: 'GurukulX Admin' },
    });
    return newUser.id;
  }
}
