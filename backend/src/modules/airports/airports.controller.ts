import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AirportsService } from './airports.service';

@ApiTags('airports')
@Controller('airports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}
}
