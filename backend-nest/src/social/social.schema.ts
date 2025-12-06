import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SocialReportDocument = SocialReport & Document;

@Schema({ timestamps: true })
export class SocialReport {
    @Prop({ required: true })
    type: string; // 'alagamento', 'vento', 'energia', 'chuva'

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    city: string;

    @Prop()
    latitude: number;

    @Prop()
    longitude: number;

    @Prop({ default: 0 })
    likes: number;

    @Prop({ default: 'anonymous' })
    userId: string;
}

export const SocialReportSchema = SchemaFactory.createForClass(SocialReport);
