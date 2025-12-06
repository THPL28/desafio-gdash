import { Controller, Get, Post, Body, Query, Param, Put } from '@nestjs/common';
import { SocialService } from './social.service';

@Controller('social')
export class SocialController {
    constructor(private readonly socialService: SocialService) { }

    @Post('reports')
    async createReport(@Body() body: any) {
        return this.socialService.createReport(body);
    }

    @Get('reports')
    async getReports(@Query('city') city?: string) {
        return this.socialService.getReports(city);
    }

    @Put('reports/:id/like')
    async likeReport(@Param('id') id: string) {
        return this.socialService.likeReport(id);
    }
}
