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

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ForumsModule,
    CoursesModule,
    ModulesModule,
    LessonsModule,
    ProgramsModule,
    WorkspacesModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
