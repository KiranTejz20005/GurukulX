import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const workspaceId = request.headers['x-workspace-id'] || request.query.workspaceId;
    const userId = request.user?.id || request.headers['x-user-id'];

    // If workspaceId is provided, verify workspace exists and optionally membership
    if (workspaceId) {
      const workspace = await this.prisma.workspace.findUnique({
        where: { id: String(workspaceId) },
      });

      if (!workspace) {
        throw new ForbiddenException(`Invalid or non-existent workspace ID: ${workspaceId}`);
      }

      if (userId) {
        const member = await this.prisma.workspaceMember.findUnique({
          where: {
            userId_workspaceId: {
              userId: String(userId),
              workspaceId: String(workspaceId),
            },
          },
        });

        if (!member) {
          throw new ForbiddenException(`User does not belong to workspace ${workspaceId}`);
        }
      }
    }

    return true;
  }
}
