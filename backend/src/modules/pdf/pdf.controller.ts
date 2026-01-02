import { Controller, Get, Param, Res, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiProduces } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PdfService } from './pdf.service';
import { FlightPlansService } from '../flight-plans/flight-plans.service';

@ApiTags('pdf')
@Controller('pdf')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly flightPlansService: FlightPlansService,
  ) {}

  @Get('flight-plan/:id')
  @ApiOperation({ summary: 'Generate PDF for flight plan' })
  @ApiProduces('application/pdf')
  async generateFlightPlanPdf(
    @Param('id') id: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const flightPlan = await this.flightPlansService.findOne(id, req.user.userId);
    const pdfBuffer = await this.pdfService.generateFlightPlanPdf(flightPlan);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="flight-plan-${id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
