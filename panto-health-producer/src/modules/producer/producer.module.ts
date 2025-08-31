import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ProducerService } from './services/producer.service';
import { ProducerController } from './controllers/producer.controller';

@Module({
  controllers: [ProducerController],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'X_RAY_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('rmq.uri')}`],
            queue: `${configService.get('rmq.queue')}`,
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [ProducerService],
  exports: [ProducerService],
})
export class ProducerModule {}
