import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAircraftDto } from './dto/create-aircraft.dto';
import { UpdateAircraftDto } from './dto/update-aircraft.dto';

@Injectable()
export class AircraftService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createAircraftDto: CreateAircraftDto) {
    return this.prisma.aircraft.create({
      data: {
        ...createAircraftDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.aircraft.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const aircraft = await this.prisma.aircraft.findFirst({
      where: { id, userId },
    });
    if (!aircraft) {
      throw new NotFoundException('Aircraft not found');
    }
    return aircraft;
  }

  async update(id: string, userId: string, updateAircraftDto: UpdateAircraftDto) {
    await this.findOne(id, userId);
    return this.prisma.aircraft.update({
      where: { id },
      data: updateAircraftDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.aircraft.delete({
      where: { id },
    });
  }
}
