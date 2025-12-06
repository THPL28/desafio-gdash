import { Injectable, HttpException } from '@nestjs/common';

@Injectable()
export class PokeApiService {
    private readonly baseUrl = 'https://pokeapi.co/api/v2/pokemon';

    async getPokemon(limit: number = 20, offset: number = 0) {
        try {
            const response = await fetch(`${this.baseUrl}?limit=${limit}&offset=${offset}`);
            if (!response.ok) {
                throw new HttpException('Failed to fetch from PokeAPI', response.status);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw new HttpException('Error fetching Pokemon data', 500);
        }
    }

    async getPokemonDetails(name: string) {
        try {
            const response = await fetch(`${this.baseUrl}/${name}`);
            if (!response.ok) {
                throw new HttpException('Pokemon not found', 404);
            }
            return await response.json();
        } catch (error) {
            throw new HttpException('Error fetching Pokemon details', 500);
        }
    }
}
