import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AirspaceService } from './airspace.service';

@ApiTags('airspace')
@Controller('airspace')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AirspaceController {
  constructor(private readonly airspaceService: AirspaceService) {}
}
