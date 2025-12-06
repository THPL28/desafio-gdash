import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateWeatherLogDto {
  @IsString()
  city: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsNumber()
  temperature: number;

  @IsOptional()
  @IsNumber()
  humidity?: number;

  @IsOptional()
  @IsNumber()
  windSpeed?: number;

  @IsOptional()
  @IsNumber()
  precipitationProbability?: number;

  @IsOptional()
  @IsNumber()
  weatherCode?: number;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsNumber()
  timestamp?: number;

  @IsOptional()
  @IsObject()
  raw?: any;
}
