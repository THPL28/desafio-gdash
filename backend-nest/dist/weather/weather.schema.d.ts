import { HydratedDocument } from 'mongoose';
export type WeatherLogDocument = HydratedDocument<WeatherLog>;
export declare class WeatherLog {
    city: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    weatherCode: number;
    uvIndex: number;
    feelsLike: number;
    precipitation: number;
    pressure: number;
    visibility: number;
    windDirection: number;
    aqi: any;
    raw: any;
    timestamp?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const WeatherLogSchema: import("mongoose").Schema<WeatherLog, import("mongoose").Model<WeatherLog, any, any, any, import("mongoose").Document<unknown, any, WeatherLog> & WeatherLog & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WeatherLog, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<WeatherLog>> & import("mongoose").FlatRecord<WeatherLog> & {
    _id: import("mongoose").Types.ObjectId;
}>;
