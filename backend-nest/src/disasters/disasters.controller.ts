import { Controller, Get } from '@nestjs/common';
import { DisastersService } from './disasters.service';

@Controller('disasters')
export class DisastersController {
  constructor(private readonly disastersService: DisastersService) {}

  @Get('reliefweb')
  async reliefweb() {
    return this.disastersService.fetchReliefWeb();
  }

  @Get('openfema')
  async openfema() {
    return this.disastersService.fetchOpenFema();
  }

  @Get('nws')
  async nws() {
    return this.disastersService.fetchNws();
  }

  @Get('gdacs')
  async gdacs() {
    return this.disastersService.fetchGdacs();
  }

  @Get('combined')
  async combined() {
    return this.disastersService.fetchCombined();
  }
}
