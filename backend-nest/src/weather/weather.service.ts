import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherLog, WeatherLogDocument } from './weather.schema';
import axios from 'axios';
import * as json2csv from 'json2csv';
import * as XLSX from 'xlsx';

export interface WeatherLogData extends Partial<WeatherLog> { }

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private forecastCache = new Map<string, { ts: number; data: any }>();
  private CACHE_TTL = 1000 * 60 * 5; // 5 minutes

  constructor(
    @InjectModel(WeatherLog.name) private weatherModel: Model<WeatherLogDocument>,
  ) { }

  async getWeather(city: string): Promise<WeatherLogData | null> {
    // 1. Buscar coordenadas (Geocoding API)
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`;
    try {
      const geoRes = await axios.get(geoUrl);
      if (!geoRes.data.results || geoRes.data.results.length === 0) {
        return null;
      }
      const { latitude, longitude, name } = geoRes.data.results[0];

      // 2. Buscar dados meteorológicos (Open-Meteo API)
      // Added: relative_humidity_2m, apparent_temperature, surface_pressure, visibility, wind_direction_10m
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max&timezone=auto`;

      const weatherRes = await axios.get(weatherUrl);
      const current = weatherRes.data.current;
      const hourly = weatherRes.data.hourly;

      // 3. Buscar dados de Qualidade do Ar (OpenAQ API) - Opcional/Exemplo
      // OpenAQ doesn't always have data for specific coords, so we try a radius or nearest city
      // For simplicity, we'll try to get data by coordinates
      const aqiData = await this.getAqiByCoords(latitude, longitude);

      // Extract UV Index for current hour
      const currentHourIndex = new Date().getHours();
      const uvIndex = hourly.uv_index ? hourly.uv_index[currentHourIndex] : 0;

      // Map Open-Meteo data to our schema
      const weatherLogData: WeatherLogData = {
        city: name,
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        condition: this.mapWeatherCode(current.weather_code),
        weatherCode: current.weather_code,
        uvIndex: uvIndex,
        feelsLike: current.apparent_temperature,
        precipitation: current.precipitation,
        pressure: current.surface_pressure,
        visibility: current.visibility, // meters
        windDirection: current.wind_direction_10m,
        aqi: aqiData,
        raw: weatherRes.data, // Store full raw data for advanced features
      };

      // Salvar no banco (opcional, ou salvar apenas periodicamente via worker)
      // await this.createLog(weatherLogData);

      return weatherLogData;
    } catch (error) {
      this.logger.error(`Error fetching weather for ${city}`, error);
      return null;
    }
  }

  async collectAndSaveWeather(city: string) {
    const weatherData = await this.getWeather(city);
    if (!weatherData) {
      throw new Error(`Could not fetch weather data for ${city}`);
    }
    return this.createLog(weatherData);
  }

  // Helper to fetch AQI
  public async getAqiByCoords(lat: number, lon: number) {
    try {
      // OpenAQ API v2
      const url = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}&radius=10000&limit=1`;
      const res = await axios.get(url);
      return res.data;
    } catch (e) {
      // this.logger.warn('Failed to fetch AQI data');
      return null;
    }
  }

  /** Normaliza os dados retornados pelo Open-Meteo para um formato consistente */
  private normalizeForecast(raw: any, period: 'hourly' | 'daily' | 'weekly') {
    if (!raw) return null;

    const normalized: any = {
      period,
      latitude: raw.latitude,
      longitude: raw.longitude,
      timezone: raw.timezone || 'UTC',
      hourly: [],
      daily: [],
      timeline: {}
    };

    // Hourly
    if (raw.hourly && raw.hourly.time) {
      const times: string[] = raw.hourly.time;
      for (let i = 0; i < times.length; i++) {
        normalized.hourly.push({
          time: times[i],
          temperature: raw.hourly.temperature_2m ? raw.hourly.temperature_2m[i] : null,
          humidity: raw.hourly.relativehumidity_2m ? raw.hourly.relativehumidity_2m[i] : null,
          apparent_temperature: raw.hourly.apparent_temperature ? raw.hourly.apparent_temperature[i] : null,
          precipitation: raw.hourly.precipitation ? raw.hourly.precipitation[i] : 0,
          uv_index: raw.hourly.uv_index ? raw.hourly.uv_index[i] : null,
          windspeed: raw.hourly.windspeed_10m ? raw.hourly.windspeed_10m[i] : null,
        });
      }
    }

    // Daily
    if (raw.daily && raw.daily.time) {
      const times: string[] = raw.daily.time;
      for (let i = 0; i < times.length; i++) {
        normalized.daily.push({
          date: times[i],
          temp_max: raw.daily.temperature_2m_max ? raw.daily.temperature_2m_max[i] : null,
          temp_min: raw.daily.temperature_2m_min ? raw.daily.temperature_2m_min[i] : null,
          precipitation_sum: raw.daily.precipitation_sum ? raw.daily.precipitation_sum[i] : 0,
          uv_index_max: raw.daily.uv_index_max ? raw.daily.uv_index_max[i] : null,
          sunrise: raw.daily.sunrise ? raw.daily.sunrise[i] : null,
          sunset: raw.daily.sunset ? raw.daily.sunset[i] : null,
        });
      }
    }

    // Timeline: derive sunrise/sunset and peak temperature hour and likely rain window
    try {
      // Sunrise/Sunset (use first daily entry)
      if (normalized.daily.length > 0) {
        normalized.timeline.sunrise = normalized.daily[0].sunrise;
        normalized.timeline.sunset = normalized.daily[0].sunset;
      }

      // Peak temperature (from hourly)
      if (normalized.hourly.length > 0) {
        let peak = normalized.hourly[0];
        for (const h of normalized.hourly) {
          if (h.temperature !== null && peak.temperature !== null && h.temperature > peak.temperature) peak = h;
        }
        normalized.timeline.peakTemp = { time: peak.time, value: peak.temperature };
      }

      // Rain window: find first contiguous block of hours with precipitation > 0
      if (normalized.hourly.length > 0) {
        let inWindow = false;
        let windowStart: string | null = null;
        let windowEnd: string | null = null;
        for (const h of normalized.hourly) {
          if (!inWindow && h.precipitation > 0) {
            inWindow = true;
            windowStart = h.time;
            windowEnd = h.time;
          } else if (inWindow && h.precipitation > 0) {
            windowEnd = h.time;
          } else if (inWindow && h.precipitation === 0) {
            break; // stop at first gap
          }
        }
        if (windowStart) normalized.timeline.rainWindow = { start: windowStart, end: windowEnd };
      }
    } catch (e) {
      // ignore timeline errors
    }

    return normalized;
  }

  async getNormalizedForecastByCity(city: string, period: 'hourly' | 'daily' | 'weekly' = 'daily') {
    const key = `city:${city.toLowerCase()}|period:${period}`;
    const cached = this.forecastCache.get(key);
    if (cached && (Date.now() - cached.ts) < this.CACHE_TTL) {
      return cached.data;
    }

    const weather = await this.getWeather(city);
    if (!weather || !weather.raw) return null;
    const normalized = this.normalizeForecast(weather.raw, period);
    this.forecastCache.set(key, { ts: Date.now(), data: normalized });
    return normalized;
  }

  async getNormalizedForecastByCoords(lat: number, lon: number, period: 'hourly' | 'daily' | 'weekly' = 'daily') {
    // Re-fetch using coords if needed, or just use the logic from getWeather but starting with coords
    // For simplicity, let's just reuse the raw data fetching logic
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max&timezone=auto`;
    try {
      const key = `coords:${lat},${lon}|period:${period}`;
      const cached = this.forecastCache.get(key);
      if (cached && (Date.now() - cached.ts) < this.CACHE_TTL) {
        return cached.data;
      }
      const res = await axios.get(weatherUrl);
      const normalized = this.normalizeForecast(res.data, period);
      this.forecastCache.set(key, { ts: Date.now(), data: normalized });
      return normalized;
    } catch (e) {
      return null;
    }
  }

  private mapWeatherCode(code: number): string {
    const mapping: Record<number, string> = {
      0: 'Céu limpo',
      1: 'Principalmente limpo',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Neblina',
      48: 'Neblina com geada',
      51: 'Garoa leve',
      53: 'Garoa moderada',
      55: 'Garoa densa',
      56: 'Garoa congelante leve',
      57: 'Garoa congelante densa',
      61: 'Chuva fraca',
      63: 'Chuva moderada',
      65: 'Chuva forte',
      66: 'Chuva congelante leve',
      67: 'Chuva congelante forte',
      71: 'Neve fraca',
      73: 'Neve moderada',
      75: 'Neve forte',
      77: 'Grãos de neve',
      80: 'Pancadas de chuva leves',
      81: 'Pancadas de chuva moderadas',
      82: 'Pancadas de chuva violentas',
      85: 'Pancadas de neve leves',
      86: 'Pancadas de neve fortes',
      95: 'Tempestade: Leve ou moderada',
      96: 'Tempestade com granizo leve',
      99: 'Tempestade com granizo forte',
    };
    return mapping[code] || `Código ${code}`;
  }

  async createLog(data: Partial<WeatherLog>): Promise<WeatherLogDocument> {
    // Se veio weatherCode e não veio 'condition', popular condition
    if ((data as any).weatherCode && !data.condition) {
      const code = Number((data as any).weatherCode);
      data.condition = this.mapWeatherCode(code);
    }

    // Se timestamp foi enviado (numero unix), converte para Date
    if ((data as any).timestamp) {
      const t = (data as any).timestamp;
      try {
        data.timestamp = typeof t === 'number' ? new Date(t * 1000) : new Date(t);
      } catch (e) {
        // ignore invalid timestamp
      }
    }

    const createdLog = await this.weatherModel.create(data);
    return createdLog;
  }

  async findAll() {
    return this.weatherModel.find().sort({ createdAt: -1 }).limit(100).exec();
  }

  async getInsights() {
    const logs = await this.weatherModel.find().sort({ createdAt: -1 }).limit(24).exec(); // Last 24 entries
    if (logs.length === 0) return { message: "Sem dados suficientes para insights." };

    // Correção de tipagem: Garantir que o campo 'temperature' existe antes de acessar.
    // Assumindo que temperature, condition, humidity, windSpeed são propriedades do WeatherLog
    const temps = logs.map(l => l.temperature).filter(t => t !== undefined);
    if (temps.length === 0) return { message: "Sem dados de temperatura suficientes para insights." };

    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);

    const lastLog = logs[0];
    // Se o Schema WeatherLog tiver 'humidity', 'windSpeed' e 'condition' eles devem ser definidos
    // Caso contrário, você pode precisar puxar esses dados do log salvo.
    const currentCondition = (lastLog as any).condition || "N/A";
    const currentHumidity = (lastLog as any).humidity || 0; // Se 'humidity' não está no schema, vai ser 0
    const currentWind = (lastLog as any).windSpeed || 0; // Se 'windSpeed' não está no schema, vai ser 0


    const summary = `Nas últimas ${logs.length} leituras, a temperatura média foi de ${avgTemp.toFixed(1)}°C. 
    Agora faz ${lastLog.temperature}°C com ${currentHumidity}% de umidade e ventos de ${currentWind} km/h (${currentCondition}).
    A tendência é de ${temps[0] > temps[temps.length - 1] ? "aquecimento" : "resfriamento"}.`;

    return {
      avgTemp: avgTemp.toFixed(1),
      maxTemp,
      minTemp,
      condition: currentCondition,
      trend: temps[0] > temps[temps.length - 1] ? "Subindo" : "Descendo",
      lastUpdate: logs[0].createdAt,
      summary
    };
  }

  // --- AI / Text Generation Logic ---
  private calculateHeatIndex(temp: number, humidity: number): number {
    // Simple Heat Index formula (Rothfusz regression) - valid for T > 27C and H > 40%
    // Using a simplified version or just returning "Feels Like" if available
    // For this demo, let's use a basic approximation if T > 25
    if (temp < 25) return temp;

    const c1 = -8.78469475556;
    const c2 = 1.61139411;
    const c3 = 2.33854883889;
    const c4 = -0.14611605;
    const c5 = -0.012308094;
    const c6 = -0.0164248277778;
    const c7 = 2.211732e-3;
    const c8 = 7.2546e-4;
    const c9 = -3.582e-6;

    const T = temp;
    const R = humidity;

    const HI = c1 + (c2 * T) + (c3 * R) + (c4 * T * R) + (c5 * T * T) + (c6 * R * R) + (c7 * T * T * R) + (c8 * T * R * R) + (c9 * T * T * R * R);
    return parseFloat(HI.toFixed(1));
  }

  private generateWeatherText(avgTemp: number, condition: string, rainChance: number, wind: number, humidity: number, question?: string): string {
    // If a question is asked, try to answer it based on data
    if (question) {
      const q = question.toLowerCase();
      if (q.includes('roupa') || q.includes('vestir')) {
        if (avgTemp > 25) return "Recomendo roupas leves, como camiseta e shorts. Está calor! 👕";
        if (avgTemp < 15) return "Melhor levar um casaco pesado. Está frio! 🧥";
        return "Uma calça jeans e camiseta devem servir. Talvez um cardigã leve.";
      }
      if (q.includes('chuva') || q.includes('guarda-chuva')) {
        if (rainChance > 40) return "Sim, há boa chance de chuva. Leve o guarda-chuva! ☔";
        return "A chance de chuva é baixa, pode deixar o guarda-chuva em casa.";
      }
      if (q.includes('correr') || q.includes('caminhada') || q.includes('exercício')) {
        if (rainChance > 50) return "Melhor evitar exercícios ao ar livre agora, pode chover.";
        if (avgTemp > 30) return "Está muito quente para exercícios intensos. Hidrate-se bem!";
        return "O clima está ótimo para atividades ao ar livre! 🏃‍♂️";
      }
      return `Com base no clima (${avgTemp}°C, ${condition}), minha resposta é: depende do seu gosto, mas parece um dia ${condition.toLowerCase()}.`;
    }

    // Default summary
    let text = `O clima hoje está ${condition.toLowerCase()}. `;

    if (avgTemp > 30) text += "Prepare-se para um dia quente, hidrate-se bem! ☀️ ";
    else if (avgTemp < 15) text += "Um casaco será bem-vindo. 🧥 ";
    else text += "Temperaturas amenas e agradáveis. ";

    if (rainChance > 50) text += "Há alta probabilidade de chuva, leve o guarda-chuva. ☔ ";
    else if (rainChance > 20) text += "Pode garoar em alguns momentos. ";

    if (wind > 20) text += "Ventos fortes soprando, atenção com objetos soltos. 🍃 ";
    if (humidity < 30) text += "Umidade baixa, evite exercícios intensos ao ar livre. 💧";

    return text;
  }

  async getAiSummary(city: string, question?: string) {
    console.log(`[getAiSummary] Request for city: ${city}, Question: ${question}`);
    try {
      const weather = await this.getWeather(city);
      if (!weather) {
        console.warn(`[getAiSummary] No weather found for ${city}`);
        return { text: "Não foi possível gerar o resumo." };
      }

      const heatIndex = this.calculateHeatIndex(weather.temperature, weather.humidity || 50);

      const summary = this.generateWeatherText(
        weather.temperature,
        weather.condition,
        weather.precipitation || 0, // Using precipitation as proxy for rain chance if not available
        weather.windSpeed,
        weather.humidity || 50,
        question
      );

      console.log(`[getAiSummary] Summary generated: ${summary}`);
      return {
        text: summary,
        details: {
          heatIndex,
          humidity: weather.humidity,
          wind: weather.windSpeed
        }
      };
    } catch (error) {
      console.error(`[getAiSummary] Error generating summary:`, error);
      throw error;
    }
  }

  async exportCsv() {
    const logs = await this.weatherModel.find().lean().exec();
    if (!logs || logs.length === 0) {
      // Return empty string to indicate no data (controller will respond 204 No Content)
      return '';
    }
    const parser = new json2csv.Parser();
    return parser.parse(logs);
  }

  async exportXlsx() {
    const logs = await this.weatherModel.find().lean().exec();
    const ws = XLSX.utils.json_to_sheet(logs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "WeatherLogs");
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }
}