import { PokeApiService } from './pokeapi.service';
export declare class PokeApiController {
    private readonly pokeApiService;
    constructor(pokeApiService: PokeApiService);
    findAll(limit?: number, offset?: number): Promise<any>;
    findOne(name: string): Promise<any>;
}
