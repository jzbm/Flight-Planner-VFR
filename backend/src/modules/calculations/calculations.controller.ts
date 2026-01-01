import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CalculationsService } from './calculations.service';
import { NavigationCalculationDto, NavigationResultDto } from './dto/navigation.dto';
import { FuelCalculationDto, FuelResultDto } from './dto/fuel.dto';

@ApiTags('calculations')
@Controller('calculations')
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Post('navigation')
  @ApiOperation({ summary: 'Calculate navigation data between two points' })
  calculateNavigation(@Body() input: NavigationCalculationDto): NavigationResultDto {
    return this.calculationsService.calculateNavigation(input);
  }

  @Post('fuel')
  @ApiOperation({ summary: 'Calculate fuel requirements' })
  calculateFuel(@Body() input: FuelCalculationDto): FuelResultDto {
    return this.calculationsService.calculateFuel(input);
  }
}
