import { IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export interface DataPoint {
  value: number;
}

export interface RawXRayData {
  time: number;
  data: DataPoint[];
}

export class CreateXRayDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsNumber()
  @IsNotEmpty()
  time: number;

  @IsNumber()
  @IsNotEmpty()
  dataLength: number;

  @IsNumber()
  @IsNotEmpty()
  dataVolume: number;

  @IsObject()
  @ValidateNested()
  raw_data: RawXRayData;
}