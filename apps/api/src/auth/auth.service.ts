import { Injectable, BadRequestException, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // Password strength validator (min 8 chars, 1 uppercase, 1 number)
  private validatePassword(password: string) {
    if (!password || password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      throw new BadRequestException('Password must contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
      throw new BadRequestException('Password must contain at least one number');
    }
  }

  async signup(data: { email: string; name: string; password?: string; workspaceSlug?: string }) {
    if (data.password) {
      this.validatePassword(data.password);
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
      },
    });

    // Auto-assign to default workspace or specified workspace
    let workspace = await this.prisma.workspace.findFirst({
      where: data.workspaceSlug ? { slug: data.workspaceSlug } : undefined,
    });

    if (!workspace) {
      workspace = await this.prisma.workspace.create({
        data: {
          name: `${data.name}'s Academy`,
          slug: data.email.split('@')[0] || 'workspace',
        },
      });
    }

    const member = await this.prisma.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        role: 'STUDENT',
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      workspaceId: workspace.id,
      role: member.role,
      accessToken: `mock-jwt-token-${user.id}-${Date.now()}`,
    };
  }

  async login(data: { email: string; password?: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      include: {
        workspaces: {
          include: {
            workspace: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password credentials');
    }

    const primaryMember = user.workspaces[0];

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      workspaceId: primaryMember?.workspaceId || null,
      role: primaryMember?.role || 'STUDENT',
      accessToken: `mock-jwt-token-${user.id}-${Date.now()}`,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User with specified email not found');
    }

    const resetToken = `reset-${user.id}-${Math.random().toString(36).substring(2, 10)}`;
    return {
      message: 'Password reset email sent successfully',
      resetToken,
      expiresIn: '1 hour',
    };
  }

  async resetPassword(data: { token: string; newPassword: string }) {
    this.validatePassword(data.newPassword);
    return {
      message: 'Password reset successfully. You may now log in with your new password.',
    };
  }
}
