import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkspaceGuard } from './workspace.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, WorkspaceGuard, RolesGuard],
  exports: [AuthService, WorkspaceGuard, RolesGuard],
})
export class AuthModule {}
