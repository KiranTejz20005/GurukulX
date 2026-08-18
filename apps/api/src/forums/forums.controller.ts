import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { ForumsService } from './forums.service';

@Controller('forums')
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @Get()
  findAll(@Query('workspaceId') workspaceId: string) {
    return this.forumsService.findAll(workspaceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forumsService.findOne(id);
  }

  @Post(':id/posts')
  createPost(
    @Param('id') forumId: string,
    @Body() body: { userId: string; content: string }
  ) {
    return this.forumsService.createPost({
      forumId,
      userId: body.userId || 'student-demo',
      content: body.content,
    });
  }

  @Delete('posts/:id')
  deletePost(@Param('id') id: string) {
    return this.forumsService.deletePost(id);
  }
}
