import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class WeightBalanceInputDto {
  @ApiProperty({ description: 'Pilot weight in kg' })
  @IsNumber()
  @Min(0)
  pilotWeight: number;

  @ApiProperty({ description: 'Co-pilot/passenger weight in kg', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  coPilotWeight?: number;

  @ApiProperty({ description: 'Rear passengers weight in kg', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  rearPassengersWeight?: number;

  @ApiProperty({ description: 'Baggage weight in kg', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  baggageWeight?: number;

  @ApiProperty({ description: 'Fuel weight in kg' })
  @IsNumber()
  @Min(0)
  fuelWeight: number;
}

export class WeightBalanceResultDto {
  @ApiProperty({ description: 'Total weight in kg' })
  totalWeight: number;

  @ApiProperty({ description: 'Center of gravity position in mm' })
  centerOfGravity: number;

  @ApiProperty({ description: 'Maximum takeoff weight in kg' })
  maxTakeoffWeight: number;

  @ApiProperty({ description: 'Is within weight limits' })
  isWithinWeightLimits: boolean;

  @ApiProperty({ description: 'Is within CG envelope' })
  isWithinCGEnvelope: boolean;

  @ApiProperty({ description: 'CG envelope points for chart' })
  cgEnvelope: { weight: number; arm: number }[];

  @ApiProperty({ description: 'Current position on CG chart' })
  currentPosition: { weight: number; arm: number };
}
