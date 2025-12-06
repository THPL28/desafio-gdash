import { useEffect, useState } from 'react';
import api from '../api/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Input } from '../components/ui/input';

export default function Explore() {
    const [pokemon, setPokemon] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const limit = 20;

    useEffect(() => {
        fetchPokemon();
    }, [offset]);

    const fetchPokemon = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
            setPokemon(res.data.results);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => setOffset(prev => prev + limit);
    const handlePrev = () => setOffset(prev => Math.max(0, prev - limit));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Explorar Pokémon</h1>
                    <p className="text-muted-foreground mt-2">Integração com PokéAPI para demonstrar paginação e consumo externo.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar (Demo)..." className="pl-8" />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="h-48 rounded-xl bg-secondary/50 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {pokemon.map((p) => {
                        const id = p.url.split('/')[6];
                        return (
                            <Card key={p.name} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
                                <CardHeader className="p-4 bg-secondary/30">
                                    <span className="text-xs font-mono text-muted-foreground">#{id.padStart(3, '0')}</span>
                                    <CardTitle className="capitalize text-center text-lg">{p.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center p-6 relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <img
                                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                                        alt={p.name}
                                        className="w-32 h-32 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <div className="flex justify-center items-center gap-4 mt-8">
                <Button variant="outline" onClick={handlePrev} disabled={offset === 0} className="gap-2">
                    <ChevronLeft size={16} /> Anterior
                </Button>
                <span className="text-sm font-medium text-muted-foreground">
                    Página {Math.floor(offset / limit) + 1}
                </span>
                <Button variant="outline" onClick={handleNext} className="gap-2">
                    Próximo <ChevronRight size={16} />
                </Button>
            </div>
        </div>
    );
}
