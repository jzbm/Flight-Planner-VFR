import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class GetWeatherDto {
  @ApiProperty({ description: 'ICAO airport code', example: 'EPWA' })
  @IsString()
  icaoCode: string;
}

export class GetWeatherByCoordinatesDto {
  @ApiProperty({ description: 'Latitude' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ description: 'Longitude' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}

export class MetarDto {
  @ApiProperty({ description: 'Raw METAR string' })
  raw: string;

  @ApiProperty({ description: 'Station ICAO code' })
  station: string;

  @ApiProperty({ description: 'Observation time' })
  time: string;

  @ApiProperty({ description: 'Wind direction in degrees', required: false })
  windDirection?: number;

  @ApiProperty({ description: 'Wind speed in knots', required: false })
  windSpeed?: number;

  @ApiProperty({ description: 'Wind gusts in knots', required: false })
  windGust?: number;

  @ApiProperty({ description: 'Visibility in meters', required: false })
  visibility?: number;

  @ApiProperty({ description: 'Temperature in Celsius', required: false })
  temperature?: number;

  @ApiProperty({ description: 'Dew point in Celsius', required: false })
  dewPoint?: number;

  @ApiProperty({ description: 'QNH pressure in hPa', required: false })
  qnh?: number;

  @ApiProperty({ description: 'Flight category', required: false })
  flightCategory?: string;
}

export class TafDto {
  @ApiProperty({ description: 'Raw TAF string' })
  raw: string;

  @ApiProperty({ description: 'Station ICAO code' })
  station: string;

  @ApiProperty({ description: 'Issue time' })
  issueTime: string;

  @ApiProperty({ description: 'Valid from time' })
  validFrom: string;

  @ApiProperty({ description: 'Valid to time' })
  validTo: string;

  @ApiProperty({ description: 'Forecast periods' })
  forecast: TafForecastPeriod[];
}

export class TafForecastPeriod {
  @ApiProperty({ description: 'Period type' })
  type: string;

  @ApiProperty({ description: 'From time' })
  from: string;

  @ApiProperty({ description: 'To time' })
  to: string;

  @ApiProperty({ description: 'Wind direction' })
  windDirection?: number;

  @ApiProperty({ description: 'Wind speed' })
  windSpeed?: number;

  @ApiProperty({ description: 'Visibility in meters' })
  visibility?: number;

  @ApiProperty({ description: 'Weather phenomena' })
  weather?: string[];
}

export class WeatherResponseDto {
  @ApiProperty({ description: 'METAR data', type: MetarDto })
  metar?: MetarDto;

  @ApiProperty({ description: 'TAF data', type: TafDto })
  taf?: TafDto;

  @ApiProperty({ description: 'Data fetched from cache' })
  fromCache: boolean;

  @ApiProperty({ description: 'Cache timestamp' })
  cachedAt?: Date;
}
