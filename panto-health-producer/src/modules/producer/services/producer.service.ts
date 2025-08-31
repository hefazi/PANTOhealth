import { Inject, Injectable, Logger } from '@nestjs/common';
import { IProducerService } from '../interfaces/producer.service.interface';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProducerService implements IProducerService {
  private readonly logger = new Logger(ProducerService.name);

  constructor(@Inject('X_RAY_SERVICE') private readonly client: ClientProxy) {}

  async sendXRayData() {
    // Sample data to simulate IoT device output
    const sampleData = {
      "66bb584d4ae73e488c30a072": {
        "data": [
          [762, [51.339764, 12.339223833333334, 1.2038000000000002]],
          [1766, [51.33977733333333, 12.339211833333334, 1.531604]],
          [2763, [51.339782, 12.339196166666667, 2.13906]]
        ],
        "time": 1735683480000
      }
    };

    try {
      this.client.emit('x-ray-queue', sampleData);
      this.logger.log('Sent sample x-ray data to RabbitMQ.');
      return { success: true, message: 'Data sent' };
    } catch (error) {
      this.logger.error('Error sending data to RabbitMQ:', error);
      return { success: false, message: 'Error sending data' };
    }
  }
}
