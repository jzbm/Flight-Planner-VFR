import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsArray, ValidateNested, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { FlightPlanStatus } from '@prisma/client';

export class CreateWaypointDto {
  @ApiProperty({ description: 'Waypoint name or identifier' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Latitude' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Longitude' })
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ description: 'Planned altitude in feet' })
  @IsNumber()
  @IsOptional()
  altitude?: number;

  @ApiPropertyOptional({ description: 'Waypoint type (airport, navaid, fix, user)' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'Sequence order' })
  @IsNumber()
  sequenceOrder: number;
}

export class CreateFlightPlanDto {
  @ApiProperty({ description: 'Flight plan title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Departure airport ICAO code' })
  @IsString()
  departureIcao: string;

  @ApiProperty({ description: 'Arrival airport ICAO code' })
  @IsString()
  arrivalIcao: string;

  @ApiPropertyOptional({ description: 'Alternate airport ICAO code' })
  @IsString()
  @IsOptional()
  alternateIcao?: string;

  @ApiPropertyOptional({ description: 'Planned departure time' })
  @IsDateString()
  @IsOptional()
  departureTime?: string;

  @ApiPropertyOptional({ description: 'Aircraft ID' })
  @IsString()
  @IsOptional()
  aircraftId?: string;

  @ApiPropertyOptional({ description: 'Cruise altitude in feet' })
  @IsNumber()
  @IsOptional()
  cruiseAltitude?: number;

  @ApiPropertyOptional({ description: 'Cruise speed in knots' })
  @IsNumber()
  @IsOptional()
  cruiseSpeed?: number;

  @ApiPropertyOptional({ description: 'Waypoints' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWaypointDto)
  @IsOptional()
  waypoints?: CreateWaypointDto[];
}
