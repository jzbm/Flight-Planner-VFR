import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FlightPlansService } from './flight-plans.service';

@ApiTags('flight-plans')
@Controller('flight-plans')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FlightPlansController {
  constructor(private readonly flightPlansService: FlightPlansService) {}
}
