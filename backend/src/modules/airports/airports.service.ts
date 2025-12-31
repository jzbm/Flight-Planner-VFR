import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';

@Injectable()
export class AirportsService {
  constructor(private prisma: PrismaService) {}

  async create(createAirportDto: CreateAirportDto) {
    return this.prisma.airport.create({
      data: createAirportDto,
    });
  }

  async findAll(search?: string) {
    const where = search
      ? {
          OR: [
            { icaoCode: { contains: search, mode: 'insensitive' as const } },
            { iataCode: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } },
            { city: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    return this.prisma.airport.findMany({
      where,
      include: { runways: true },
      orderBy: { icaoCode: 'asc' },
      take: 100,
    });
  }

  async findOne(id: string) {
    const airport = await this.prisma.airport.findUnique({
      where: { id },
      include: { runways: true },
    });
    if (!airport) {
      throw new NotFoundException('Airport not found');
    }
    return airport;
  }

  async findByIcao(icaoCode: string) {
    const airport = await this.prisma.airport.findUnique({
      where: { icaoCode: icaoCode.toUpperCase() },
      include: { runways: true },
    });
    if (!airport) {
      throw new NotFoundException(`Airport ${icaoCode} not found`);
    }
    return airport;
  }

  async update(id: string, updateAirportDto: UpdateAirportDto) {
    await this.findOne(id);
    return this.prisma.airport.update({
      where: { id },
      data: updateAirportDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.airport.delete({
      where: { id },
    });
  }

  async findNearby(latitude: number, longitude: number, radiusKm: number = 50) {
    // distance calculation using harversine approximation
    const latDelta = radiusKm / 111; // ~111km per degree latitude
    const lonDelta = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180));

    return this.prisma.airport.findMany({
      where: {
        latitude: {
          gte: latitude - latDelta,
          lte: latitude + latDelta,
        },
        longitude: {
          gte: longitude - lonDelta,
          lte: longitude + lonDelta,
        },
      },
      include: { runways: true },
    });
  }
}
