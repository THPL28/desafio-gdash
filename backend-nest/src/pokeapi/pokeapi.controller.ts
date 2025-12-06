import { Controller, Get, Query, Param } from '@nestjs/common';
import { PokeApiService } from './pokeapi.service';

@Controller('pokemon')
export class PokeApiController {
    constructor(private readonly pokeApiService: PokeApiService) { }

    @Get()
    async findAll(@Query('limit') limit: number = 20, @Query('offset') offset: number = 0) {
        return this.pokeApiService.getPokemon(limit, offset);
    }

    @Get(':name')
    async findOne(@Param('name') name: string) {
        return this.pokeApiService.getPokemonDetails(name);
    }
}
