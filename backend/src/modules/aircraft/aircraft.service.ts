import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AircraftService {
  constructor(private prisma: PrismaService) {}
}
