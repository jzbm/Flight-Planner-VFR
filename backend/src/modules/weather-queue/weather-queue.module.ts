import { Module } from '@nestjs/common';
import { WeatherQueueService } from './weather-queue.service';
import { WeatherModule } from '../weather/weather.module';
import { RabbitMQModule } from '../../rabbitmq/rabbitmq.module';

@Module({
  imports: [WeatherModule, RabbitMQModule],
  providers: [WeatherQueueService],
  exports: [WeatherQueueService],
})
export class WeatherQueueModule {}
