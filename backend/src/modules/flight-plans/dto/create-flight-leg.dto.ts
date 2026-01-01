import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateFlightLegDto {
  @ApiProperty({ description: 'Leg sequence number' })
  @IsNumber()
  @Min(1)
  sequence: number;

  @ApiProperty({ description: 'From waypoint name' })
  @IsString()
  fromWaypoint: string;

  @ApiProperty({ description: 'To waypoint name' })
  @IsString()
  toWaypoint: string;

  @ApiProperty({ description: 'Distance in nautical miles' })
  @IsNumber()
  @Min(0)
  distance: number;

  @ApiProperty({ description: 'True course in degrees' })
  @IsNumber()
  @Min(0)
  @Max(360)
  trueCourse: number;

  @ApiProperty({ description: 'Magnetic course in degrees' })
  @IsNumber()
  @Min(0)
  @Max(360)
  magneticCourse: number;

  @ApiProperty({ description: 'True heading in degrees' })
  @IsNumber()
  @Min(0)
  @Max(360)
  trueHeading: number;

  @ApiProperty({ description: 'Magnetic heading in degrees' })
  @IsNumber()
  @Min(0)
  @Max(360)
  magneticHeading: number;

  @ApiProperty({ description: 'Ground speed in knots' })
  @IsNumber()
  @Min(0)
  groundSpeed: number;

  @ApiProperty({ description: 'Estimated time enroute in minutes' })
  @IsNumber()
  @Min(0)
  ete: number;

  @ApiProperty({ description: 'Fuel required in liters' })
  @IsNumber()
  @Min(0)
  fuelRequired: number;

  @ApiProperty({ description: 'Wind direction in degrees', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(360)
  windDirection?: number;

  @ApiProperty({ description: 'Wind speed in knots', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  windSpeed?: number;
}
