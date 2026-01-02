import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WeatherService } from './weather.service';
import { WeatherResponseDto } from './dto/weather.dto';

@ApiTags('weather')
@Controller('weather')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':icaoCode')
  @ApiOperation({ summary: 'Get METAR and TAF for airport' })
  @ApiParam({ name: 'icaoCode', description: 'ICAO airport code', example: 'EPWA' })
  @ApiResponse({ status: 200, description: 'Weather data', type: WeatherResponseDto })
  getWeather(@Param('icaoCode') icaoCode: string) {
    return this.weatherService.getWeather(icaoCode);
  }
}
