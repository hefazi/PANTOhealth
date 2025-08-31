import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DataPoint = [number, [number, number, number]];

export type XRayDocument = HydratedDocument<XRay>;

@Schema({
  collection: 'signals',
  timestamps: true,
})
export class XRay {
  @Prop({ required: true, index: true })
  deviceId: string;

  @Prop({ required: true })
  time: number;

  @Prop()
  dataLength: number;

  @Prop()
  dataVolume: number;

  @Prop({ type: Object, required: true })
  raw_data: Record<string, unknown>;
}

export const XRaySchema = SchemaFactory.createForClass(XRay);