import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Length, Min, Max } from 'class-validator';

export class CreateAirportDto {
  @ApiProperty({ description: 'ICAO code', example: 'EPWA' })
  @IsString()
  @Length(4, 4)
  icaoCode: string;

  @ApiPropertyOptional({ description: 'IATA code', example: 'WAW' })
  @IsString()
  @IsOptional()
  @Length(3, 3)
  iataCode?: string;

  @ApiProperty({ description: 'Airport name', example: 'Warsaw Chopin Airport' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'City name', example: 'Warsaw' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ description: 'Country name', example: 'Poland' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ description: 'Latitude in decimal degrees', example: 52.1657 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ description: 'Longitude in decimal degrees', example: 20.9671 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({ description: 'Elevation in feet', example: 361 })
  @IsNumber()
  elevation: number;
}
