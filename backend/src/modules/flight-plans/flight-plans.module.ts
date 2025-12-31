import { Module } from '@nestjs/common';
import { FlightPlansService } from './flight-plans.service';
import { FlightPlansController } from './flight-plans.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FlightPlansController],
  providers: [FlightPlansService],
  exports: [FlightPlansService],
})
export class FlightPlansModule {}
