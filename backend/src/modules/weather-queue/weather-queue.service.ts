import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import * as amqp from 'amqplib';

@Injectable()
export class WeatherQueueService implements OnModuleInit {
  private readonly logger = new Logger(WeatherQueueService.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly QUEUE_NAME = 'weather_requests';

  constructor(private readonly weatherService: WeatherService) {}

  async onModuleInit() {
    try {
      await this.connect();
      await this.consumeMessages();
      this.logger.log('Weather queue consumer initialized');
    } catch (error) {
      this.logger.error(`Failed to initialize queue consumer: ${error.message}`);
    }
  }

  private async connect() {
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    this.connection = await amqp.connect(rabbitmqUrl);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.QUEUE_NAME, { durable: true });
  }

  private async consumeMessages() {
    this.channel.consume(this.QUEUE_NAME, async (msg) => {
      if (msg) {
        try {
          const { icaoCode } = JSON.parse(msg.content.toString());
          this.logger.log(`Processing weather request for ${icaoCode}`);
          
          await this.weatherService.getWeather(icaoCode);
          this.channel.ack(msg);
          
          this.logger.log(`Weather request completed for ${icaoCode}`);
        } catch (error) {
          this.logger.error(`Failed to process weather request: ${error.message}`);
          this.channel.nack(msg, false, false);
        }
      }
    });
  }

  async queueWeatherRequest(icaoCode: string) {
    try {
      this.channel.sendToQueue(
        this.QUEUE_NAME,
        Buffer.from(JSON.stringify({ icaoCode })),
        { persistent: true },
      );
      this.logger.log(`Queued weather request for ${icaoCode}`);
    } catch (error) {
      this.logger.error(`Failed to queue weather request: ${error.message}`);
      throw error;
    }
  }
}
