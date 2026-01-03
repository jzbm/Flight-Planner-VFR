import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AircraftModule } from './modules/aircraft/aircraft.module';
import { AirportsModule } from './modules/airports/airports.module';
import { FlightPlansModule } from './modules/flight-plans/flight-plans.module';
import { CalculationsModule } from './modules/calculations/calculations.module';
import { WeatherModule } from './modules/weather/weather.module';
import { WeatherQueueModule } from './modules/weather-queue/weather-queue.module';
import { NotamModule } from './modules/notam/notam.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { AirspaceModule } from './modules/airspace/airspace.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RabbitMQModule,
    AuthModule,
    UsersModule,
    AircraftModule,
    AirportsModule,
    FlightPlansModule,
    CalculationsModule,
    WeatherModule,
    WeatherQueueModule,
    NotamModule,
    PdfModule,
    AirspaceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
