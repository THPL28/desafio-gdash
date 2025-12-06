import { useEffect, useState } from 'react';
import api from '../api/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Pokemon {
    name: string;
    url: string;
}

export default function PokemonPage() {
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);
    const limit = 20;

    useEffect(() => {
        fetchPokemon();
    }, [offset]);

    const fetchPokemon = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
            setPokemon(res.data.results);
            setTotal(res.data.count);
        } catch (err) {
            console.error(err);
            setError('Falha ao carregar Pokémon.');
        } finally {
            setLoading(false);
        }
    };

    const getPokemonId = (url: string) => {
        const parts = url.split('/');
        return parts[parts.length - 2];
    };

    const getSpriteUrl = (id: string) => {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    };

    const handleNext = () => {
        if (offset + limit < total) {
            setOffset(offset + limit);
        }
    };

    const handlePrev = () => {
        if (offset - limit >= 0) {
            setOffset(offset - limit);
        }
    };

    const filtered = pokemon.filter(p => p.name.includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-blue-100">Pokémon</h1>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-400" />
                    <Input
                        placeholder="Buscar Pokémon..."
                        className="pl-8 bg-blue-950/30 border-blue-500/30 text-blue-100 placeholder:text-blue-400/50"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                </div>
            ) : error ? (
                <div className="text-red-400 text-center p-4 border border-red-500/30 rounded-lg bg-red-950/20">
                    {error}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filtered.map((p, i) => {
                            const id = getPokemonId(p.url);
                            return (
                                <Card key={i} className="glass-dark border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group bg-blue-950/20 hover:bg-blue-900/30">
                                    <CardHeader className="text-center pb-2">
                                        <CardTitle className="capitalize text-lg text-blue-200 group-hover:text-blue-100 transition-colors">
                                            {p.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex justify-center pb-6">
                                        <div className="w-32 h-32 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <img
                                                src={getSpriteUrl(id)}
                                                alt={p.name}
                                                className="w-28 h-28 object-contain z-10 rendering-pixelated"
                                                loading="lazy"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="flex justify-center items-center gap-4 mt-8">
                        <Button
                            variant="outline"
                            onClick={handlePrev}
                            disabled={offset === 0}
                            className="border-blue-500/30 hover:bg-blue-900/50 text-blue-200"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Anterior
                        </Button>
                        <span className="text-blue-200 text-sm">
                            Página {Math.floor(offset / limit) + 1} de {Math.ceil(total / limit)}
                        </span>
                        <Button
                            variant="outline"
                            onClick={handleNext}
                            disabled={offset + limit >= total}
                            className="border-blue-500/30 hover:bg-blue-900/50 text-blue-200"
                        >
                            Próximo
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
