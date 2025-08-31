import { Injectable, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { IXRayService } from '../interfaces/x.ray.service.interface';
import { InjectModel } from '@nestjs/mongoose';
import { DataPoint, XRay, XRayDocument } from '../schemas/x.ray.schema';
import { Model } from 'mongoose';
import { CreateXRayDto } from '../dtos/create.x.ray.dto';
import { UpdateXRayDto } from '../dtos/update.x.ray.dto';

@Injectable()
export class XRayService implements IXRayService {
  private readonly logger = new Logger(XRayService.name);

  constructor(@InjectModel(XRay.name) private xrayModel: Model<XRayDocument>) {}

  @MessagePattern('x-ray-data')
  async processXRayData(@Payload() data: Record<string, any>): Promise<void> {
    this.logger.log('Received new x-ray data message from RabbitMQ');

    try {
      const deviceId = Object.keys(data)[0];
      const deviceData = data[deviceId];

      if (!deviceData) {
        this.logger.error('Invalid data format received. Missing device data.');
        return;
      }

      const time = deviceData.time;
      const rawDataArray = deviceData.data as DataPoint[];
      const dataLength = rawDataArray.length;
      const dataVolume = JSON.stringify(deviceData.data).length; // Calculate a simple data volume

      const newXRayDocument = new this.xrayModel({
        deviceId,
        time,
        dataLength,
        dataVolume,
        raw_data: deviceData,
      });

      await newXRayDocument.save();
      this.logger.log(`Successfully processed and saved x-ray data for device: ${deviceId}`);

    } catch (error) {
      this.logger.error('Error processing or saving x-ray data:', error.stack);
    }
  }

  async create(createXRayDto: CreateXRayDto): Promise<XRay> {
    const newXRay = new this.xrayModel(createXRayDto);
    return newXRay.save();
  }

  async findAll(): Promise<XRay[]> {
    return this.xrayModel.find().exec();
  }

  async findOne(id: string): Promise<XRay> {
    return this.xrayModel.findById(id).exec();
  }

  async update(id: string, updateXRayDto: UpdateXRayDto): Promise<XRay> {
    await this.xrayModel.findByIdAndUpdate(id, updateXRayDto).exec();
    return this.findOne(id);
  }

  async delete(id: string): Promise<any> {
    return await this.xrayModel.deleteOne({ _id: id }).exec();
  }

  async findFiltered(deviceId?: string, startTime?: number, endTime?: number): Promise<XRay[]> {
    const query: any = {};
    if (deviceId) {
      query.deviceId = deviceId;
    }
    if (startTime || endTime) {
      query.time = {};
      if (startTime) {
        query.time.$gte = startTime;
      }
      if (endTime) {
        query.time.$lte = endTime;
      }
    }
    return this.xrayModel.find(query).exec();
  }

}
