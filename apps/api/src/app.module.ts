import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
import { LessonsModule } from './lessons/lessons.module';
import { ProgramsModule } from './programs/programs.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { MediaModule } from './media/media.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ForumsModule } from './forums/forums.module';
import { StatsModule } from './stats/stats.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    NotificationsModule,
    ForumsModule,
    CoursesModule,
    ModulesModule,
    LessonsModule,
    ProgramsModule,
    WorkspacesModule,
    MediaModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
