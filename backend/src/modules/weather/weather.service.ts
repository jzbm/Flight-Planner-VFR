import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WeatherResponseDto, MetarDto, TafDto } from './dto/weather.dto';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly CACHE_TTL_MINUTES = 30;
  private readonly AVWX_API_URL = 'https://avwx.rest/api';

  constructor(private prisma: PrismaService) {}

  async getWeather(icaoCode: string): Promise<WeatherResponseDto> {
    const upperIcao = icaoCode.toUpperCase();

    // Check cache first
    const cached = await this.getCachedWeather(upperIcao);
    if (cached) {
      return {
        metar: cached.metar as unknown as MetarDto,
        taf: cached.taf as unknown as TafDto,
        fromCache: true,
        cachedAt: cached.fetchedAt,
      };
    }

    // Fetch fresh data
    const [metar, taf] = await Promise.all([
      this.fetchMetar(upperIcao),
      this.fetchTaf(upperIcao),
    ]);

    // Cache the data
    await this.cacheWeather(upperIcao, metar, taf);

    return {
      metar,
      taf,
      fromCache: false,
    };
  }

  private async getCachedWeather(icaoCode: string) {
    const cacheExpiry = new Date(Date.now() - this.CACHE_TTL_MINUTES * 60 * 1000);

    return this.prisma.weatherData.findFirst({
      where: {
        icaoCode,
        fetchedAt: { gte: cacheExpiry },
      },
      orderBy: { fetchedAt: 'desc' },
    });
  }

  private async cacheWeather(icaoCode: string, metar: MetarDto | null, taf: TafDto | null) {
    try {
      await this.prisma.weatherData.create({
        data: {
          icaoCode,
          metar: metar as any,
          taf: taf as any,
          fetchedAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.warn(`Failed to cache weather for ${icaoCode}: ${error.message}`);
    }
  }

  private async fetchMetar(icaoCode: string): Promise<MetarDto | null> {
    try {
      const response = await fetch(`${this.AVWX_API_URL}/metar/${icaoCode}`, {
        headers: {
          Authorization: `Bearer ${process.env.AVWX_API_KEY}`,
        },
      });

      if (!response.ok) {
        this.logger.warn(`METAR fetch failed for ${icaoCode}: ${response.status}`);
        return null;
      }

      const data = await response.json();
      return this.parseMetar(data);
    } catch (error) {
      this.logger.error(`METAR fetch error for ${icaoCode}: ${error.message}`);
      return null;
    }
  }

  private async fetchTaf(icaoCode: string): Promise<TafDto | null> {
    try {
      const response = await fetch(`${this.AVWX_API_URL}/taf/${icaoCode}`, {
        headers: {
          Authorization: `Bearer ${process.env.AVWX_API_KEY}`,
        },
      });

      if (!response.ok) {
        this.logger.warn(`TAF fetch failed for ${icaoCode}: ${response.status}`);
        return null;
      }

      const data = await response.json();
      return this.parseTaf(data);
    } catch (error) {
      this.logger.error(`TAF fetch error for ${icaoCode}: ${error.message}`);
      return null;
    }
  }

  private parseMetar(data: any): MetarDto {
    return {
      raw: data.raw || '',
      station: data.station || '',
      time: data.time?.repr || '',
      windDirection: data.wind_direction?.value,
      windSpeed: data.wind_speed?.value,
      windGust: data.wind_gust?.value,
      visibility: data.visibility?.value,
      temperature: data.temperature?.value,
      dewPoint: data.dewpoint?.value,
      qnh: data.altimeter?.value,
      flightCategory: data.flight_rules,
    };
  }

  private parseTaf(data: any): TafDto {
    return {
      raw: data.raw || '',
      station: data.station || '',
      issueTime: data.time?.repr || '',
      validFrom: data.start_time?.repr || '',
      validTo: data.end_time?.repr || '',
      forecast: (data.forecast || []).map((f: any) => ({
        type: f.type || 'BASE',
        from: f.start_time?.repr || '',
        to: f.end_time?.repr || '',
        windDirection: f.wind_direction?.value,
        windSpeed: f.wind_speed?.value,
        visibility: f.visibility?.value,
        weather: f.wx_codes?.map((w: any) => w.repr) || [],
      })),
    };
  }
}
