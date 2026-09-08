import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Headers,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Headers('x-workspace-id') workspaceId?: string) {
    return this.notificationsService.findAll(workspaceId);
  }

  @Patch('mark-all-read')
  markAllRead(@Headers('x-workspace-id') workspaceId?: string) {
    return this.notificationsService.markAllRead(workspaceId);
  }

  @Patch(':id/read')
  markOneRead(@Param('id') id: string) {
    return this.notificationsService.markOneRead(id);
  }

  @Delete('clear-all')
  clearAll(@Headers('x-workspace-id') workspaceId?: string) {
    return this.notificationsService.clearAll(workspaceId);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.notificationsService.deleteOne(id);
  }
}
