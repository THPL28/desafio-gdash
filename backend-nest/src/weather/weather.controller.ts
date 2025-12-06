import { Controller, Get, Post, Query, HttpCode, Res, HttpException, HttpStatus, Body } from '@nestjs/common';
import { CreateWeatherLogDto } from './dto/create-weather-log.dto';
import { Response } from 'express';
// Importação do serviço e da interface WeatherLogData exportada
import { WeatherService, WeatherLogData } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) { }

  /**
   * Endpoint público para buscar dados de clima em tempo real para uma cidade.
   * Não salva no banco de dados.
   * @param city A cidade para buscar o clima.
   * @returns WeatherLogData (Dados de clima formatados).
   */
  @Get()
  async getWeather(@Query('city') city: string): Promise<WeatherLogData> {
    if (!city) {
      throw new HttpException('O parâmetro "city" é obrigatório.', HttpStatus.BAD_REQUEST);
    }
    return this.weatherService.getWeather(city);
  }

  /**
   * Endpoint privado/interno (geralmente chamado por um Worker ou cron job) para:
   * 1. Coletar o clima da cidade padrão (via query ou configuração).
   * 2. Salvar o log no banco de dados.
   * * A chamada a 'collectAndSaveWeather' garante que o campo 'city' seja incluído,
   * resolvendo o erro de validação do Mongoose.
   * * Para o worker de SP, use a query: POST /weather/collect?city=São%20Paulo
   * @param city A cidade para coletar e salvar (ex: São Paulo).
   */
  @Post('collect')
  @HttpCode(HttpStatus.CREATED)
  async collectWeatherLog(@Query('city') city: string = 'São Paulo') {
    if (!city) {
      throw new HttpException('O parâmetro "city" é obrigatório para a coleta.', HttpStatus.BAD_REQUEST);
    }
    // Este método centraliza a busca e o salvamento, garantindo a inclusão da cidade.
    return this.weatherService.collectAndSaveWeather(city);
  }

  /**
   * Retorna os últimos logs de clima salvos.
   */
  @Get('logs')
  async getLogs() {
    return this.weatherService.findAll();
  }

  /**
   * Endpoint que recebe logs diretamente (chamado pelo worker Go).
   * Espera um body JSON com os campos do WeatherLog (city, temperature, humidity, windSpeed, condition, raw, ...)
   */
  @Post('logs')
  @HttpCode(HttpStatus.CREATED)
  async receiveLog(@Body() body: CreateWeatherLogDto) {
    // DTO será validado automaticamente pela ValidationPipe
    return this.weatherService.createLog(body as any);
  }

  /**
   * Retorna insights e sumarização dos dados de clima recentes.
   */
  @Get('insights')
  async getInsights() {
    return this.weatherService.getInsights();
  }

  @Get('ai-summary')
  async getAiSummary(@Query('city') city: string = 'São Paulo') {
    return this.weatherService.getAiSummary(city);
  }

  @Get('forecast')
  async getForecast(@Query('city') city: string, @Query('lat') lat?: string, @Query('lon') lon?: string, @Query('period') period: 'hourly' | 'daily' | 'weekly' = 'hourly') {
    try {
      if (city) {
        return await this.weatherService.getNormalizedForecastByCity(city, period);
      }
      if (lat && lon) {
        const latitude = Number(lat);
        const longitude = Number(lon);
        return await this.weatherService.getNormalizedForecastByCoords(latitude, longitude, period);
      }
      throw new HttpException('Parâmetros inválidos: informe `city` ou `lat` e `lon`.', 400);
    } catch (e: any) {
      throw new HttpException(e.message || 'Erro ao buscar previsão', 502);
    }
  }

  @Get('aqi')
  async getAqi(@Query('lat') lat: string, @Query('lon') lon: string) {
    if (!lat || !lon) throw new Error('Parâmetros inválidos: lat e lon são obrigatórios.');
    const latitude = Number(lat);
    const longitude = Number(lon);
    return this.weatherService.getAqiByCoords(latitude, longitude);
  }

  /**
   * Exporta os dados de log em formato CSV.
   */
  @Get('export/csv')
  async exportCsv(@Res() res: Response) {
    const csvData = await this.weatherService.exportCsv();
    if (!csvData || csvData === '') {
      return res.status(204).send();
    }
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="weather_logs.csv"');
    res.send(csvData);
  }

  /**
   * Exporta os dados de log em formato XLSX.
   */
  @Get('export/xlsx')
  async exportXlsx(@Res() res: Response) {
    const xlsxBuffer = await this.weatherService.exportXlsx();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="weather_logs.xlsx"');
    // Envia o buffer como resposta
    res.send(xlsxBuffer);
  }
}