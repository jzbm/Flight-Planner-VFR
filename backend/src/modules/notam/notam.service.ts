import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotamService {
  constructor(private prisma: PrismaService) {}
}
