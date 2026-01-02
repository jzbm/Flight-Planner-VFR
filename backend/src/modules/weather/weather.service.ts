import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WeatherService {
  constructor(private prisma: PrismaService) {}
}
