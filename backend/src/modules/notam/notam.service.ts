import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotamResponseDto, NotamItemDto } from './dto/notam.dto';

@Injectable()
export class NotamService {
  private readonly logger = new Logger(NotamService.name);
  private readonly CACHE_TTL_HOURS = 6;
  private readonly NOTAM_API_URL = 'https://applications.icao.int/dataservices/api/notams-realtime-list';

  constructor(private prisma: PrismaService) {}

  async getNotams(icaoCode: string): Promise<NotamResponseDto> {
    const upperIcao = icaoCode.toUpperCase();

    // Check cache first
    const cached = await this.getCachedNotams(upperIcao);
    if (cached) {
      return {
        icaoCode: upperIcao,
        notams: cached.notams as unknown as NotamItemDto[],
        count: (cached.notams as any[]).length,
        fromCache: true,
        cachedAt: cached.fetchedAt,
      };
    }

    // Fetch fresh data
    const notams = await this.fetchNotams(upperIcao);

    // Cache the data
    await this.cacheNotams(upperIcao, notams);

    return {
      icaoCode: upperIcao,
      notams,
      count: notams.length,
      fromCache: false,
    };
  }

  private async getCachedNotams(icaoCode: string) {
    const cacheExpiry = new Date(Date.now() - this.CACHE_TTL_HOURS * 60 * 60 * 1000);

    return this.prisma.notamData.findFirst({
      where: {
        icaoCode,
        fetchedAt: { gte: cacheExpiry },
      },
      orderBy: { fetchedAt: 'desc' },
    });
  }

  private async cacheNotams(icaoCode: string, notams: NotamItemDto[]) {
    try {
      await this.prisma.notamData.create({
        data: {
          icaoCode,
          notams: notams as any,
          fetchedAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.warn(`Failed to cache NOTAMs for ${icaoCode}: ${error.message}`);
    }
  }

  private async fetchNotams(icaoCode: string): Promise<NotamItemDto[]> {
    try {
      const apiKey = process.env.ICAO_API_KEY;
      const response = await fetch(
        `${this.NOTAM_API_URL}?api_key=${apiKey}&format=json&locations=${icaoCode}`,
      );

      if (!response.ok) {
        this.logger.warn(`NOTAM fetch failed for ${icaoCode}: ${response.status}`);
        return [];
      }

      const data = await response.json();
      return this.parseNotams(data);
    } catch (error) {
      this.logger.error(`NOTAM fetch error for ${icaoCode}: ${error.message}`);
      return [];
    }
  }

  private parseNotams(data: any[]): NotamItemDto[] {
    if (!Array.isArray(data)) return [];

    return data.map((notam, index) => ({
      id: notam.id || `notam-${index}`,
      notamId: notam.key || notam.id || '',
      location: notam.location || '',
      raw: notam.all || notam.message || '',
      type: notam.type || 'N',
      effectiveFrom: new Date(notam.startvalidity || notam.effectiveStart),
      effectiveTo: new Date(notam.endvalidity || notam.effectiveEnd),
      isPermanent: notam.Permanent === 'YES' || notam.endvalidity === 'PERM',
      qLine: this.parseQLine(notam.Qcode),
      description: notam.ItemE || notam.message || '',
      category: this.categorizeNotam(notam),
    }));
  }

  private parseQLine(qCode: string): any {
    if (!qCode) return undefined;
    return {
      fir: qCode.substring(0, 4),
      code: qCode,
      traffic: 'IFR/VFR',
      purpose: 'B',
      scope: 'A',
      lowerLimit: 0,
      upperLimit: 999,
    };
  }

  private categorizeNotam(notam: any): string {
    const qCode = notam.Qcode || '';
    if (qCode.includes('FA') || qCode.includes('AD')) return 'AERODROME';
    if (qCode.includes('W')) return 'WARNING';
    return 'ENROUTE';
  }
}
