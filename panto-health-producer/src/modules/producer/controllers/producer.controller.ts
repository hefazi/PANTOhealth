import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProducerService } from '../services/producer.service';

@ApiTags('producer')
@Controller({
  version: '1',
  path: '/producer',
})
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post('send-xray')
  async sendXRayData() {
    return this.producerService.sendXRayData();
  }
}
