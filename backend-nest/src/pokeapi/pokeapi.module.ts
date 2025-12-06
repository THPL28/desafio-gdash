import { Module } from '@nestjs/common';
import { PokeApiController } from './pokeapi.controller';
import { PokeApiService } from './pokeapi.service';

@Module({
    controllers: [PokeApiController],
    providers: [PokeApiService],
})
export class PokeApiModule { }
