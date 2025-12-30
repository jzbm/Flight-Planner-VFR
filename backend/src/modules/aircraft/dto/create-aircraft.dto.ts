import { IsString, IsNumber, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum FuelUnit {
  LITERS = 'LITERS',
  GALLONS = 'GALLONS',
}

export class CreateAircraftDto {
  @ApiProperty({ example: 'SP-KYS' })
  @IsString()
  registration: string;

  @ApiProperty({ example: 'C152' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: 'My Cessna' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  cruiseSpeed: number;

  @ApiProperty({ example: 24 })
  @IsNumber()
  fuelConsumption: number;

  @ApiPropertyOptional({ enum: FuelUnit, default: FuelUnit.LITERS })
  @IsEnum(FuelUnit)
  @IsOptional()
  fuelUnit?: FuelUnit;

  @ApiProperty({ example: 510 })
  @IsNumber()
  emptyWeight: number;

  @ApiProperty({ example: 757 })
  @IsNumber()
  maxTakeoffWeight: number;

  @ApiProperty({ example: 98 })
  @IsNumber()
  usableFuel: number;

  @ApiPropertyOptional({ example: 84.5 })
  @IsNumber()
  @IsOptional()
  emptyWeightArm?: number;

  @ApiPropertyOptional({ example: 94 })
  @IsNumber()
  @IsOptional()
  fuelArm?: number;

  @ApiPropertyOptional({ example: 85 })
  @IsNumber()
  @IsOptional()
  frontSeatArm?: number;

  @ApiPropertyOptional({ example: 117 })
  @IsNumber()
  @IsOptional()
  rearSeatArm?: number;

  @ApiPropertyOptional({ example: 140 })
  @IsNumber()
  @IsOptional()
  baggageArm?: number;

  @ApiPropertyOptional({ example: 82.5 })
  @IsNumber()
  @IsOptional()
  forwardCGLimit?: number;

  @ApiPropertyOptional({ example: 93.5 })
  @IsNumber()
  @IsOptional()
  aftCGLimit?: number;

  @ApiPropertyOptional({ example: 54 })
  @IsNumber()
  @IsOptional()
  maxBaggageWeight?: number;

  @ApiPropertyOptional({ example: [[82.5, 500], [82.5, 757], [93.5, 757], [93.5, 500]] })
  @IsArray()
  @IsOptional()
  cgEnvelope?: number[][];
}
