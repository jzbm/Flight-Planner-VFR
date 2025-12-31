import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AirportsService } from './airports.service';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';

@ApiTags('airports')
@Controller('airports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new airport' })
  create(@Body() createAirportDto: CreateAirportDto) {
    return this.airportsService.create(createAirportDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all airports with optional search' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by ICAO, IATA, name or city' })
  findAll(@Query('search') search?: string) {
    return this.airportsService.findAll(search);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find airports near a location' })
  @ApiQuery({ name: 'lat', required: true, description: 'Latitude' })
  @ApiQuery({ name: 'lon', required: true, description: 'Longitude' })
  @ApiQuery({ name: 'radius', required: false, description: 'Radius in km (default: 50)' })
  findNearby(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
    @Query('radius') radius?: string,
  ) {
    return this.airportsService.findNearby(
      parseFloat(lat),
      parseFloat(lon),
      radius ? parseFloat(radius) : 50,
    );
  }

  @Get('icao/:icaoCode')
  @ApiOperation({ summary: 'Get airport by ICAO code' })
  findByIcao(@Param('icaoCode') icaoCode: string) {
    return this.airportsService.findByIcao(icaoCode);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get airport by ID' })
  findOne(@Param('id') id: string) {
    return this.airportsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update airport' })
  update(@Param('id') id: string, @Body() updateAirportDto: UpdateAirportDto) {
    return this.airportsService.update(id, updateAirportDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete airport' })
  remove(@Param('id') id: string) {
    return this.airportsService.remove(id);
  }
}
