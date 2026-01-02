import { Module } from '@nestjs/common';
import { AirspaceService } from './airspace.service';
import { AirspaceController } from './airspace.controller';

@Module({
  controllers: [AirspaceController],
  providers: [AirspaceService],
  exports: [AirspaceService],
})
export class AirspaceModule {}
