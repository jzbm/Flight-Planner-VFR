import { ApiProperty } from '@nestjs/swagger';

export class NotamItemDto {
  @ApiProperty({ description: 'NOTAM ID' })
  id: string;

  @ApiProperty({ description: 'NOTAM series and number' })
  notamId: string;

  @ApiProperty({ description: 'Location ICAO code' })
  location: string;

  @ApiProperty({ description: 'Raw NOTAM text' })
  raw: string;

  @ApiProperty({ description: 'NOTAM type (N/R/C)' })
  type: string;

  @ApiProperty({ description: 'Effective from datetime' })
  effectiveFrom: Date;

  @ApiProperty({ description: 'Effective to datetime' })
  effectiveTo: Date;

  @ApiProperty({ description: 'Is permanent NOTAM' })
  isPermanent: boolean;

  @ApiProperty({ description: 'Q-line decoded info', required: false })
  qLine?: {
    fir: string;
    code: string;
    traffic: string;
    purpose: string;
    scope: string;
    lowerLimit: number;
    upperLimit: number;
    coordinates?: { lat: number; lon: number };
    radius?: number;
  };

  @ApiProperty({ description: 'E-line (plain text description)' })
  description: string;

  @ApiProperty({ description: 'Category (AERODROME/ENROUTE/WARNING)' })
  category: string;
}

export class NotamResponseDto {
  @ApiProperty({ description: 'ICAO code queried' })
  icaoCode: string;

  @ApiProperty({ description: 'List of active NOTAMs', type: [NotamItemDto] })
  notams: NotamItemDto[];

  @ApiProperty({ description: 'Total count of NOTAMs' })
  count: number;

  @ApiProperty({ description: 'Data fetched from cache' })
  fromCache: boolean;

  @ApiProperty({ description: 'Cache timestamp' })
  cachedAt?: Date;
}
