import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { XRayService } from '../services/x.ray.service';
import { XRay } from '../schemas/x.ray.schema';

@ApiTags('message')
@Controller({
  version: '1',
  path: '/x-ray',
})
export class XRayController {
  constructor(private readonly xRayService: XRayService) {}

  @Post()
  async create(@Body() createXRayDto: any): Promise<XRay> {
    return this.xRayService.create(createXRayDto);
  }

  @Get()
  async findAll(): Promise<XRay[]> {
    return this.xRayService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<XRay> {
    const signal = await this.xRayService.findOne(id);
    if (!signal) {
      throw new HttpException('Signal not found', HttpStatus.NOT_FOUND);
    }
    return signal;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateXRayDto: any): Promise<XRay> {
    const signal = await this.xRayService.update(id, updateXRayDto);
    if (!signal) {
      throw new HttpException('Signal not found', HttpStatus.NOT_FOUND);
    }
    return signal;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    const result = await this.xRayService.delete(id);
    if (result.deletedCount === 0) {
      throw new HttpException('Signal not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Signal deleted successfully' };
  }

  @Get('filter')
  async findFiltered(
    @Query('deviceId') deviceId?: string,
    @Query('startTime') startTime?: string,
    @Query('endTime') endTime?: string,
  ): Promise<XRay[]> {
    const parsedStartTime = startTime ? parseInt(startTime, 10) : undefined;
    const parsedEndTime = endTime ? parseInt(endTime, 10) : undefined;

    if ((startTime && isNaN(parsedStartTime)) || (endTime && isNaN(parsedEndTime))) {
      throw new HttpException('Invalid timestamp format. Use a valid number.', HttpStatus.BAD_REQUEST);
    }

    return this.xRayService.findFiltered(deviceId, parsedStartTime, parsedEndTime);
  }
}
