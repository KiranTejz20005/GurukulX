import { Module } from '@nestjs/common';
import { AudienceController } from './audience.controller';
import { AudienceService } from './audience.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AudienceController],
  providers: [AudienceService],
})
export class AudienceModule {}
