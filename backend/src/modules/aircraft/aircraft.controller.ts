import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AircraftService } from './aircraft.service';

@ApiTags('aircraft')
@Controller('aircraft')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AircraftController {
  constructor(private readonly aircraftService: AircraftService) {}
}
