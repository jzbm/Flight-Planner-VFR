import { ApiProperty } from '@nestjs/swagger';

export class AirspaceDto {
  @ApiProperty({ description: 'Airspace name' })
  name: string;

  @ApiProperty({ description: 'Airspace class (A-G)' })
  class: string;

  @ApiProperty({ description: 'Airspace type (CTR/TMA/ATZ/etc)' })
  type: string;

  @ApiProperty({ description: 'Lower limit in feet' })
  lowerLimit: number;

  @ApiProperty({ description: 'Lower limit reference (AGL/AMSL)' })
  lowerLimitRef: string;

  @ApiProperty({ description: 'Upper limit in feet' })
  upperLimit: number;

  @ApiProperty({ description: 'Upper limit reference (AGL/AMSL/FL)' })
  upperLimitRef: string;

  @ApiProperty({ description: 'Controlling frequency' })
  frequency?: string;

  @ApiProperty({ description: 'Geometry polygon coordinates' })
  geometry: { lat: number; lon: number }[];
}

export class AirspaceQueryDto {
  @ApiProperty({ description: 'Center latitude' })
  lat: number;

  @ApiProperty({ description: 'Center longitude' })
  lon: number;

  @ApiProperty({ description: 'Radius in nautical miles' })
  radius: number;
}
