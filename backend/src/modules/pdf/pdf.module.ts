import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { FlightPlansModule } from '../flight-plans/flight-plans.module';
import { WeatherModule } from '../weather/weather.module';
import { NotamModule } from '../notam/notam.module';

@Module({
  imports: [FlightPlansModule, WeatherModule, NotamModule],
  controllers: [PdfController],
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {}
