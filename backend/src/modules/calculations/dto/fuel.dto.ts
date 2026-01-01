import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional } from 'class-validator';

export class FuelCalculationDto {
  @ApiProperty({ description: 'Trip fuel consumption rate in L/h' })
  @IsNumber()
  @Min(0)
  fuelConsumptionRate: number;

  @ApiProperty({ description: 'Trip time in minutes' })
  @IsNumber()
  @Min(0)
  tripTime: number;

  @ApiProperty({ description: 'Taxi fuel in liters', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  taxiFuel?: number;

  @ApiProperty({ description: 'Contingency percentage', required: false, default: 10 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  contingencyPercent?: number;

  @ApiProperty({ description: 'Alternate fuel in liters', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  alternateFuel?: number;

  @ApiProperty({ description: 'Final reserve time in minutes', required: false, default: 45 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  finalReserveMinutes?: number;
}

export class FuelResultDto {
  @ApiProperty({ description: 'Trip fuel in liters' })
  tripFuel: number;

  @ApiProperty({ description: 'Taxi fuel in liters' })
  taxiFuel: number;

  @ApiProperty({ description: 'Contingency fuel in liters' })
  contingencyFuel: number;

  @ApiProperty({ description: 'Alternate fuel in liters' })
  alternateFuel: number;

  @ApiProperty({ description: 'Final reserve fuel in liters' })
  finalReserveFuel: number;

  @ApiProperty({ description: 'Minimum fuel required in liters' })
  minimumFuel: number;

  @ApiProperty({ description: 'Total fuel required including taxi in liters' })
  totalFuel: number;
}
