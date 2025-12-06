"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherController = void 0;
const common_1 = require("@nestjs/common");
const create_weather_log_dto_1 = require("./dto/create-weather-log.dto");
const express_1 = require("express");
const weather_service_1 = require("./weather.service");
let WeatherController = class WeatherController {
    constructor(weatherService) {
        this.weatherService = weatherService;
    }
    async getWeather(city) {
        if (!city) {
            throw new common_1.HttpException('O parâmetro "city" é obrigatório.', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.weatherService.getWeather(city);
    }
    async collectWeatherLog(city = 'São Paulo') {
        if (!city) {
            throw new common_1.HttpException('O parâmetro "city" é obrigatório para a coleta.', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.weatherService.collectAndSaveWeather(city);
    }
    async getLogs() {
        return this.weatherService.findAll();
    }
    async receiveLog(body) {
        return this.weatherService.createLog(body);
    }
    async getInsights() {
        return this.weatherService.getInsights();
    }
    async getAiSummary(city = 'São Paulo') {
        return this.weatherService.getAiSummary(city);
    }
    async getForecast(city, lat, lon, period = 'hourly') {
        try {
            if (city) {
                return await this.weatherService.getNormalizedForecastByCity(city, period);
            }
            if (lat && lon) {
                const latitude = Number(lat);
                const longitude = Number(lon);
                return await this.weatherService.getNormalizedForecastByCoords(latitude, longitude, period);
            }
            throw new common_1.HttpException('Parâmetros inválidos: informe `city` ou `lat` e `lon`.', 400);
        }
        catch (e) {
            throw new common_1.HttpException(e.message || 'Erro ao buscar previsão', 502);
        }
    }
    async getAqi(lat, lon) {
        if (!lat || !lon)
            throw new Error('Parâmetros inválidos: lat e lon são obrigatórios.');
        const latitude = Number(lat);
        const longitude = Number(lon);
        return this.weatherService.getAqiByCoords(latitude, longitude);
    }
    async exportCsv(res) {
        const csvData = await this.weatherService.exportCsv();
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="weather_logs.csv"');
        res.send(csvData);
    }
    async exportXlsx(res) {
        const xlsxBuffer = await this.weatherService.exportXlsx();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="weather_logs.xlsx"');
        res.send(xlsxBuffer);
    }
};
exports.WeatherController = WeatherController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "getWeather", null);
__decorate([
    (0, common_1.Post)('collect'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Query)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "collectWeatherLog", null);
__decorate([
    (0, common_1.Get)('logs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Post)('logs'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_weather_log_dto_1.CreateWeatherLogDto]),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "receiveLog", null);
__decorate([
    (0, common_1.Get)('insights'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "getInsights", null);
__decorate([
    (0, common_1.Get)('ai-summary'),
    __param(0, (0, common_1.Query)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "getAiSummary", null);
__decorate([
    (0, common_1.Get)('forecast'),
    __param(0, (0, common_1.Query)('city')),
    __param(1, (0, common_1.Query)('lat')),
    __param(2, (0, common_1.Query)('lon')),
    __param(3, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "getForecast", null);
__decorate([
    (0, common_1.Get)('aqi'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lon')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "getAqi", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Get)('export/xlsx'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "exportXlsx", null);
exports.WeatherController = WeatherController = __decorate([
    (0, common_1.Controller)('weather'),
    __metadata("design:paramtypes", [weather_service_1.WeatherService])
], WeatherController);
//# sourceMappingURL=weather.controller.js.map