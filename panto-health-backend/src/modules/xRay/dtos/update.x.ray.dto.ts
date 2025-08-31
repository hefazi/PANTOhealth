import { IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RawXRayData } from './create.x.ray.dto';

export class UpdateXRayDto {
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