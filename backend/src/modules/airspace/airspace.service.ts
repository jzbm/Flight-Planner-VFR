import { Injectable, Logger } from '@nestjs/common';
import { AirspaceDto } from './dto/airspace.dto';

@Injectable()
export class AirspaceService {
  private readonly logger = new Logger(AirspaceService.name);
  private readonly OPENAIP_API_URL = 'https://api.openAIP.net/api/airspaces';

  async getAirspacesInRadius(lat: number, lon: number, radiusNm: number): Promise<AirspaceDto[]> {
    try {
      const radiusMeters = radiusNm * 1852;
      const response = await fetch(
        `${this.OPENAIP_API_URL}?lat=${lat}&lon=${lon}&radius=${radiusMeters}`,
        {
          headers: {
            'x-aip-token': process.env.OPENAIP_API_KEY || '',
          },
        },
      );

      if (!response.ok) {
        this.logger.warn(`Airspace fetch failed: ${response.status}`);
        return [];
      }

      const data = await response.json();
      return this.parseAirspaces(data);
    } catch (error) {
      this.logger.error(`Airspace fetch error: ${error.message}`);
      return [];
    }
  }

  async getAirspacesAlongRoute(
    waypoints: { lat: number; lon: number }[],
  ): Promise<AirspaceDto[]> {
    const allAirspaces = new Map<string, AirspaceDto>();

    for (const waypoint of waypoints) {
      const airspaces = await this.getAirspacesInRadius(waypoint.lat, waypoint.lon, 10);
      airspaces.forEach((a) => allAirspaces.set(a.name, a));
    }

    return Array.from(allAirspaces.values());
  }

  private parseAirspaces(data: any): AirspaceDto[] {
    if (!data?.items || !Array.isArray(data.items)) return [];

    return data.items.map((item: any) => ({
      name: item.name || 'Unknown',
      class: item.icaoClass || 'G',
      type: item.type || 'OTHER',
      lowerLimit: item.lowerLimit?.value || 0,
      lowerLimitRef: item.lowerLimit?.referenceDatum || 'AGL',
      upperLimit: item.upperLimit?.value || 0,
      upperLimitRef: item.upperLimit?.referenceDatum || 'AMSL',
      frequency: item.frequency?.value,
      geometry: this.parseGeometry(item.geometry),
    }));
  }

  private parseGeometry(geometry: any): { lat: number; lon: number }[] {
    if (!geometry?.coordinates) return [];

    // GeoJSON polygon format
    const coords = geometry.coordinates[0] || [];
    return coords.map((coord: number[]) => ({
      lon: coord[0],
      lat: coord[1],
    }));
  }
}
