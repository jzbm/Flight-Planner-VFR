import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFlightPlanDto } from './dto/create-flight-plan.dto';
import { UpdateFlightPlanDto } from './dto/update-flight-plan.dto';

@Injectable()
export class FlightPlansService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createFlightPlanDto: CreateFlightPlanDto) {
    const { waypoints, ...flightPlanData } = createFlightPlanDto;

    return this.prisma.flightPlan.create({
      data: {
        ...flightPlanData,
        userId,
        waypoints: {
          create: waypoints?.map((wp, index) => ({
            ...wp,
            sequence: index + 1,
          })),
        },
      },
      include: {
        waypoints: { orderBy: { sequence: 'asc' } },
        aircraft: true,
        departureAirport: true,
        arrivalAirport: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.flightPlan.findMany({
      where: { userId },
      include: {
        aircraft: true,
        departureAirport: true,
        arrivalAirport: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const flightPlan = await this.prisma.flightPlan.findFirst({
      where: { id, userId },
      include: {
        waypoints: { orderBy: { sequence: 'asc' } },
        legs: { orderBy: { sequence: 'asc' } },
        aircraft: true,
        departureAirport: true,
        arrivalAirport: true,
      },
    });

    if (!flightPlan) {
      throw new NotFoundException('Flight plan not found');
    }

    return flightPlan;
  }

  async update(id: string, userId: string, updateFlightPlanDto: UpdateFlightPlanDto) {
    await this.findOne(id, userId);

    const { waypoints, ...flightPlanData } = updateFlightPlanDto;

    // waypoints logic
    if (waypoints) {
      await this.prisma.waypoint.deleteMany({
        where: { flightPlanId: id },
      });
    }

    return this.prisma.flightPlan.update({
      where: { id },
      data: {
        ...flightPlanData,
        ...(waypoints && {
          waypoints: {
            create: waypoints.map((wp, index) => ({
              ...wp,
              sequence: index + 1,
            })),
          },
        }),
      },
      include: {
        waypoints: { orderBy: { sequence: 'asc' } },
        aircraft: true,
        departureAirport: true,
        arrivalAirport: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    // Delete related records 
    await this.prisma.waypoint.deleteMany({ where: { flightPlanId: id } });
    await this.prisma.flightLeg.deleteMany({ where: { flightPlanId: id } });

    return this.prisma.flightPlan.delete({
      where: { id },
    });
  }
}
