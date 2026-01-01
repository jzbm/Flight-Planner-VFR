import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max, IsOptional } from 'class-validator';

export class NavigationCalculationDto {
  @ApiProperty({ description: 'Start latitude' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  startLat: number;

  @ApiProperty({ description: 'Start longitude' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  startLon: number;

  @ApiProperty({ description: 'End latitude' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  endLat: number;

  @ApiProperty({ description: 'End longitude' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  endLon: number;

  @ApiProperty({ description: 'True airspeed in knots' })
  @IsNumber()
  @Min(0)
  tas: number;

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

  @ApiProperty({ description: 'Magnetic variation (positive = East)', required: false })
  @IsNumber()
  @IsOptional()
  magneticVariation?: number;
}

export class NavigationResultDto {
  @ApiProperty({ description: 'Distance in nautical miles' })
  distance: number;

  @ApiProperty({ description: 'True course in degrees' })
  trueCourse: number;

  @ApiProperty({ description: 'Magnetic course in degrees' })
  magneticCourse: number;

  @ApiProperty({ description: 'True heading in degrees' })
  trueHeading: number;

  @ApiProperty({ description: 'Magnetic heading in degrees' })
  magneticHeading: number;

  @ApiProperty({ description: 'Ground speed in knots' })
  groundSpeed: number;

  @ApiProperty({ description: 'Wind correction angle in degrees' })
  windCorrectionAngle: number;

  @ApiProperty({ description: 'Estimated time enroute in minutes' })
  ete: number;
}
