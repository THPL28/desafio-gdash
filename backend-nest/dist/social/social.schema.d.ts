import { Document } from 'mongoose';
export type SocialReportDocument = SocialReport & Document;
export declare class SocialReport {
    type: string;
    description: string;
    city: string;
    latitude: number;
    longitude: number;
    likes: number;
    userId: string;
}
export declare const SocialReportSchema: import("mongoose").Schema<SocialReport, import("mongoose").Model<SocialReport, any, any, any, Document<unknown, any, SocialReport> & SocialReport & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SocialReport, Document<unknown, {}, import("mongoose").FlatRecord<SocialReport>> & import("mongoose").FlatRecord<SocialReport> & {
    _id: import("mongoose").Types.ObjectId;
}>;
