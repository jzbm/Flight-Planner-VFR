import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotamService } from './notam.service';
import { NotamResponseDto } from './dto/notam.dto';

@ApiTags('notam')
@Controller('notam')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotamController {
  constructor(private readonly notamService: NotamService) {}

  @Get(':icaoCode')
  @ApiOperation({ summary: 'Get active NOTAMs for airport/FIR' })
  @ApiParam({ name: 'icaoCode', description: 'ICAO airport or FIR code', example: 'EPWA' })
  @ApiResponse({ status: 200, description: 'NOTAM data', type: NotamResponseDto })
  getNotams(@Param('icaoCode') icaoCode: string) {
    return this.notamService.getNotams(icaoCode);
  }
}
