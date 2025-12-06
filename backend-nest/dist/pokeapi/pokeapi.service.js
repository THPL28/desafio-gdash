"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeApiService = void 0;
const common_1 = require("@nestjs/common");
let PokeApiService = class PokeApiService {
    constructor() {
        this.baseUrl = 'https://pokeapi.co/api/v2/pokemon';
    }
    async getPokemon(limit = 20, offset = 0) {
        try {
            const response = await fetch(`${this.baseUrl}?limit=${limit}&offset=${offset}`);
            if (!response.ok) {
                throw new common_1.HttpException('Failed to fetch from PokeAPI', response.status);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            throw new common_1.HttpException('Error fetching Pokemon data', 500);
        }
    }
    async getPokemonDetails(name) {
        try {
            const response = await fetch(`${this.baseUrl}/${name}`);
            if (!response.ok) {
                throw new common_1.HttpException('Pokemon not found', 404);
            }
            return await response.json();
        }
        catch (error) {
            throw new common_1.HttpException('Error fetching Pokemon details', 500);
        }
    }
};
exports.PokeApiService = PokeApiService;
exports.PokeApiService = PokeApiService = __decorate([
    (0, common_1.Injectable)()
], PokeApiService);
//# sourceMappingURL=pokeapi.service.js.map