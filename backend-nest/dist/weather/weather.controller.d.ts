import { CreateWeatherLogDto } from './dto/create-weather-log.dto';
import { Response } from 'express';
import { WeatherService, WeatherLogData } from './weather.service';
export declare class WeatherController {
    private readonly weatherService;
    constructor(weatherService: WeatherService);
    getWeather(city: string): Promise<WeatherLogData>;
    collectWeatherLog(city?: string): Promise<import("mongoose").Document<unknown, {}, import("./weather.schema").WeatherLog> & import("./weather.schema").WeatherLog & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getLogs(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./weather.schema").WeatherLog> & import("./weather.schema").WeatherLog & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./weather.schema").WeatherLog> & import("./weather.schema").WeatherLog & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    receiveLog(body: CreateWeatherLogDto): Promise<import("mongoose").Document<unknown, {}, import("./weather.schema").WeatherLog> & import("./weather.schema").WeatherLog & {
        _id: import("mongoose").Types.ObjectId;
    }>;
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
    getAiSummary(city?: string): Promise<{
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
    getForecast(city: string, lat?: string, lon?: string, period?: 'hourly' | 'daily' | 'weekly'): Promise<any>;
    getAqi(lat: string, lon: string): Promise<any>;
    exportCsv(res: Response): Promise<void>;
    exportXlsx(res: Response): Promise<void>;
}
