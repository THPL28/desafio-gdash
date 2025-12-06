import { Model } from 'mongoose';
import { WeatherLog, WeatherLogDocument } from './weather.schema';
export interface WeatherLogData extends Partial<WeatherLog> {
}
export declare class WeatherService {
    private weatherModel;
    private readonly logger;
    constructor(weatherModel: Model<WeatherLogDocument>);
    getWeather(city: string): Promise<WeatherLogData | null>;
    collectAndSaveWeather(city: string): Promise<import("mongoose").Document<unknown, {}, WeatherLog> & WeatherLog & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getAqiByCoords(lat: number, lon: number): Promise<any>;
    private normalizeForecast;
    getNormalizedForecastByCity(city: string, period?: 'hourly' | 'daily' | 'weekly'): Promise<any>;
    getNormalizedForecastByCoords(lat: number, lon: number, period?: 'hourly' | 'daily' | 'weekly'): Promise<any>;
    private mapWeatherCode;
    createLog(data: Partial<WeatherLog>): Promise<WeatherLogDocument>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, WeatherLog> & WeatherLog & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, WeatherLog> & WeatherLog & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getInsights(): Promise<{
        message: string;
        avgTemp?: undefined;
        maxTemp?: undefined;
        minTemp?: undefined;
        condition?: undefined;
        trend?: undefined;
        lastUpdate?: undefined;
        summary?: undefined;
    } | {
        avgTemp: string;
        maxTemp: number;
        minTemp: number;
        condition: any;
        trend: string;
        lastUpdate: Date;
        summary: string;
        message?: undefined;
    }>;
    private calculateHeatIndex;
    private generateWeatherText;
    getAiSummary(city: string, question?: string): Promise<{
        text: string;
        details?: undefined;
    } | {
        text: string;
        details: {
            heatIndex: number;
            humidity: number;
            wind: number;
        };
    }>;
    exportCsv(): Promise<any>;
    exportXlsx(): Promise<any>;
}
