export declare class PokeApiService {
    private readonly baseUrl;
    getPokemon(limit?: number, offset?: number): Promise<any>;
    getPokemonDetails(name: string): Promise<any>;
}
