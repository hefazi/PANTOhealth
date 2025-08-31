import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { XRayService } from './services/x.ray.service';
import { XRayController } from './controllers/x.ray.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { XRay, XRaySchema } from './schemas/x.ray.schema';

@Module({
  controllers: [XRayController],
  imports: [
    MongooseModule.forFeature([{ name: XRay.name, schema: XRaySchema }]),
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
  providers: [XRayService],
  exports: [XRayService],
})
export class XRayModule {}
