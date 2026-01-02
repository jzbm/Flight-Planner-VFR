import { Module } from '@nestjs/common';
import { NotamService } from './notam.service';
import { NotamController } from './notam.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotamController],
  providers: [NotamService],
  exports: [NotamService],
})
export class NotamModule {}
