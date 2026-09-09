import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { AudienceService } from './audience.service';

@Controller('audience')
export class AudienceController {
  constructor(private readonly audienceService: AudienceService) {}

  @Get('members')
  getMembers(
    @Headers('x-workspace-id') workspaceId: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.audienceService.getMembers(workspaceId || 'dev-workspace-123', search, role);
  }

  @Post('invite')
  inviteMember(
    @Headers('x-workspace-id') workspaceId: string,
    @Body() body: { email: string; role: string },
  ) {
    return this.audienceService.inviteMember(
      workspaceId || 'dev-workspace-123',
      body.email,
      body.role,
    );
  }

  @Get('invites')
  getPendingInvites(@Headers('x-workspace-id') workspaceId: string) {
    return this.audienceService.getPendingInvites(workspaceId || 'dev-workspace-123');
  }

  @Delete('invites/:id')
  revokeInvite(@Param('id') inviteId: string) {
    return this.audienceService.revokeInvite(inviteId);
  }

  @Post('reset-progress')
  resetStudentProgress(@Body() body: { courseId: string; userId: string }) {
    return this.audienceService.resetStudentProgress(body.courseId, body.userId);
  }

  @Delete('members/:userId')
  removeMember(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('userId') userId: string,
  ) {
    return this.audienceService.removeMember(workspaceId || 'dev-workspace-123', userId);
  }

  @Patch('members/:userId/role')
  updateMemberRole(
    @Headers('x-workspace-id') workspaceId: string,
    @Param('userId') userId: string,
    @Body() body: { role: string },
  ) {
    return this.audienceService.updateMemberRole(
      workspaceId || 'dev-workspace-123',
      userId,
      body.role,
    );
  }
}
