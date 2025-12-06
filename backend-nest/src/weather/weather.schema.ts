import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WeatherLogDocument = HydratedDocument<WeatherLog>;

@Schema({ timestamps: true })
export class WeatherLog {
  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  temperature: number;

  @Prop()
  humidity: number;

  @Prop()
  windSpeed: number;

  @Prop()
  condition: string;

  @Prop()
  weatherCode: number;

  @Prop()
  uvIndex: number;

  @Prop()
  feelsLike: number;

  @Prop()
  precipitation: number;

  @Prop()
  pressure: number;

  @Prop()
  visibility: number;

  @Prop()
  windDirection: number;

  @Prop({ type: Object })
  aqi: any;

  @Prop({ type: Object })
  raw: any;

  @Prop()
  timestamp?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);
