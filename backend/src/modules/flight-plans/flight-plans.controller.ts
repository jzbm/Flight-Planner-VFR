import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FlightPlansService } from './flight-plans.service';
import { CreateFlightPlanDto } from './dto/create-flight-plan.dto';
import { UpdateFlightPlanDto } from './dto/update-flight-plan.dto';

@ApiTags('flight-plans')
@Controller('flight-plans')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FlightPlansController {
  constructor(private readonly flightPlansService: FlightPlansService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new flight plan' })
  create(@Request() req, @Body() createFlightPlanDto: CreateFlightPlanDto) {
    return this.flightPlansService.create(req.user.userId, createFlightPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all flight plans for current user' })
  findAll(@Request() req) {
    return this.flightPlansService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get flight plan by ID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.flightPlansService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update flight plan' })
  update(@Param('id') id: string, @Request() req, @Body() updateFlightPlanDto: UpdateFlightPlanDto) {
    return this.flightPlansService.update(id, req.user.userId, updateFlightPlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete flight plan' })
  remove(@Param('id') id: string, @Request() req) {
    return this.flightPlansService.remove(id, req.user.userId);
  }

  @Post(':id/legs')
  @ApiOperation({ summary: 'Add calculated legs to flight plan' })
  addLegs(@Param('id') id: string, @Request() req, @Body() legs: any[]) {
    return this.flightPlansService.addLegs(id, req.user.userId, legs);
  }

  @Get(':id/legs')
  @ApiOperation({ summary: 'Get flight plan legs' })
  getLegs(@Param('id') id: string, @Request() req) {
    return this.flightPlansService.getLegs(id, req.user.userId);
  }
}
