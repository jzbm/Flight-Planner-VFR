import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotamService } from './notam.service';

@ApiTags('notam')
@Controller('notam')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotamController {
  constructor(private readonly notamService: NotamService) {}
}
