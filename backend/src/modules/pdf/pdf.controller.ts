import { Controller, Get, Param, Res, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiProduces, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PdfService } from './pdf.service';
import { FlightPlansService } from '../flight-plans/flight-plans.service';
import { WeatherService } from '../weather/weather.service';
import { NotamService } from '../notam/notam.service';

@ApiTags('pdf')
@Controller('pdf')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly flightPlansService: FlightPlansService,
    private readonly weatherService: WeatherService,
    private readonly notamService: NotamService,
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

  @Get('weather-briefing/:icaoCode')
  @ApiOperation({ summary: 'Generate weather briefing PDF for airport' })
  @ApiParam({ name: 'icaoCode', description: 'ICAO airport code', example: 'EPWA' })
  @ApiProduces('application/pdf')
  async generateWeatherBriefingPdf(
    @Param('icaoCode') icaoCode: string,
    @Res() res: Response,
  ) {
    const [weatherData, notamData] = await Promise.all([
      this.weatherService.getWeather(icaoCode),
      this.notamService.getNotams(icaoCode),
    ]);

    const pdfBuffer = await this.pdfService.generateWeatherBriefingPdf({
      icaoCode: icaoCode.toUpperCase(),
      metar: weatherData.metar,
      taf: weatherData.taf,
      notams: notamData.notams,
    });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="weather-briefing-${icaoCode}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
