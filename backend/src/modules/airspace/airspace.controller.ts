import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AirspaceService } from './airspace.service';
import { AirspaceResponseDto } from './dto/airspace.dto';

@ApiTags('airspace')
@Controller('airspace')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AirspaceController {
  constructor(private readonly airspaceService: AirspaceService) {}

  @Get()
  @ApiOperation({ summary: 'Get airspace data for bounding box' })
  @ApiQuery({ name: 'minLat', type: Number, description: 'Minimum latitude' })
  @ApiQuery({ name: 'maxLat', type: Number, description: 'Maximum latitude' })
  @ApiQuery({ name: 'minLon', type: Number, description: 'Minimum longitude' })
  @ApiQuery({ name: 'maxLon', type: Number, description: 'Maximum longitude' })
  @ApiResponse({ status: 200, description: 'Airspace data', type: AirspaceResponseDto })
  getAirspace(
    @Query('minLat') minLat: number,
    @Query('maxLat') maxLat: number,
    @Query('minLon') minLon: number,
    @Query('maxLon') maxLon: number,
  ) {
    return this.airspaceService.getAirspaceInBounds(
      Number(minLat),
      Number(maxLat),
      Number(minLon),
      Number(maxLon),
    );
  }

  @Get('route')
  @ApiOperation({ summary: 'Get airspace along route' })
  @ApiQuery({ name: 'coordinates', type: String, description: 'Route coordinates as JSON array' })
  getAirspaceAlongRoute(@Query('coordinates') coordinates: string) {
    const coords = JSON.parse(coordinates);
    return this.airspaceService.getAirspaceAlongRoute(coords);
  }
}
