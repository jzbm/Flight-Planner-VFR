import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAircraftDto } from './dto/create-aircraft.dto';
import { UpdateAircraftDto } from './dto/update-aircraft.dto';
import { WeightBalanceInputDto, WeightBalanceResultDto } from './dto/weight-balance.dto';

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

  async calculateWeightBalance(
    id: string,
    userId: string,
    input: WeightBalanceInputDto,
  ): Promise<WeightBalanceResultDto> {
    const aircraft = await this.findOne(id, userId);

    // Station arms (typical for light aircraft, in mm from datum)
    const pilotArm = 940;
    const coPilotArm = 940;
    const rearArm = 1870;
    const baggageArm = 2440;
    const fuelArm = 1170;

    // Calculate moments
    const emptyMoment = aircraft.emptyWeight * aircraft.emptyWeightArm;
    const pilotMoment = input.pilotWeight * pilotArm;
    const coPilotMoment = (input.coPilotWeight || 0) * coPilotArm;
    const rearMoment = (input.rearPassengersWeight || 0) * rearArm;
    const baggageMoment = (input.baggageWeight || 0) * baggageArm;
    const fuelMoment = input.fuelWeight * fuelArm;

    // Total weight and CG
    const totalWeight =
      aircraft.emptyWeight +
      input.pilotWeight +
      (input.coPilotWeight || 0) +
      (input.rearPassengersWeight || 0) +
      (input.baggageWeight || 0) +
      input.fuelWeight;

    const totalMoment =
      emptyMoment + pilotMoment + coPilotMoment + rearMoment + baggageMoment + fuelMoment;

    const centerOfGravity = totalMoment / totalWeight;

    // Check limits
    const isWithinWeightLimits = totalWeight <= aircraft.maxTakeoffWeight;
    const cgEnvelope = (aircraft.cgEnvelope as { weight: number; arm: number }[]) || [];
    const isWithinCGEnvelope = this.checkCGEnvelope(totalWeight, centerOfGravity, cgEnvelope);

    return {
      totalWeight,
      centerOfGravity: Math.round(centerOfGravity),
      maxTakeoffWeight: aircraft.maxTakeoffWeight,
      isWithinWeightLimits,
      isWithinCGEnvelope,
      cgEnvelope,
      currentPosition: { weight: totalWeight, arm: Math.round(centerOfGravity) },
    };
  }

  private checkCGEnvelope(
    weight: number,
    cg: number,
    envelope: { weight: number; arm: number }[],
  ): boolean {
    if (envelope.length < 3) return true;

    // Ray casting algorithm to check if point is inside polygon
    let inside = false;
    for (let i = 0, j = envelope.length - 1; i < envelope.length; j = i++) {
      const xi = envelope[i].arm;
      const yi = envelope[i].weight;
      const xj = envelope[j].arm;
      const yj = envelope[j].weight;

      if (
        yi > weight !== yj > weight &&
        cg < ((xj - xi) * (weight - yi)) / (yj - yi) + xi
      ) {
        inside = !inside;
      }
    }
    return inside;
  }
}
