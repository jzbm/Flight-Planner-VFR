import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AircraftService } from './aircraft.service';
import { CreateAircraftDto } from './dto/create-aircraft.dto';
import { UpdateAircraftDto } from './dto/update-aircraft.dto';
import { WeightBalanceInputDto, WeightBalanceResultDto } from './dto/weight-balance.dto';

@ApiTags('aircraft')
@Controller('aircraft')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AircraftController {
  constructor(private readonly aircraftService: AircraftService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new aircraft' })
  create(@Request() req, @Body() createAircraftDto: CreateAircraftDto) {
    return this.aircraftService.create(req.user.userId, createAircraftDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all aircraft for current user' })
  findAll(@Request() req) {
    return this.aircraftService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get aircraft by ID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.aircraftService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update aircraft' })
  update(@Param('id') id: string, @Request() req, @Body() updateAircraftDto: UpdateAircraftDto) {
    return this.aircraftService.update(id, req.user.userId, updateAircraftDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete aircraft' })
  remove(@Param('id') id: string, @Request() req) {
    return this.aircraftService.remove(id, req.user.userId);
  }

  @Post(':id/weight-balance')
  @ApiOperation({ summary: 'Calculate weight and balance for aircraft' })
  @ApiResponse({ status: 200, description: 'Weight and balance calculation result', type: WeightBalanceResultDto })
  calculateWeightBalance(
    @Param('id') id: string,
    @Request() req,
    @Body() input: WeightBalanceInputDto,
  ) {
    return this.aircraftService.calculateWeightBalance(id, req.user.userId, input);
  }
}
