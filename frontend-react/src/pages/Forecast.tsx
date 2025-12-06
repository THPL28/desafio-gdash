import { useEffect, useState } from 'react';
import api from '../api/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Wind, Droplets, Sun } from 'lucide-react';

interface ForecastItem {
    dt: number;
    temp: { day: number; min: number; max: number };
    weather: { description: string; icon: string }[];
    humidity: number;
    wind_speed: number;
}

export default function ForecastPage() {
    const [forecast, setForecast] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchForecast();
    }, []);

    const fetchForecast = async () => {
        try {
            // Default to São Paulo daily forecast
            const res = await api.get('/weather/forecast?city=São Paulo&period=daily');
            // O backend retorna { daily: [...] }
            setForecast(res.data.daily || []);
        } catch (error) {
            console.error('Error fetching forecast:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: string) => {
        // date: '2025-12-06'
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' });
    };

    return (
        <div className="p-6 space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-blue-100 flex items-center gap-3">
                    <Calendar className="text-blue-400" />
                    Previsão Detalhada
                </h1>
                <p className="text-blue-300 mt-2">Planeje sua semana com dados precisos.</p>
            </header>

            {loading ? (
                <div className="text-blue-400 text-center py-12">Carregando previsão...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {forecast.map((day, index) => (
                        <Card key={index} className="glass-dark border-blue-500/20 bg-blue-950/20 hover:bg-blue-900/20 transition-all">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-blue-100 flex justify-between items-center">
                                    <span className="capitalize">{formatDate(day.date)}</span>
                                    <Sun className="text-yellow-400 w-6 h-6" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-3xl font-bold text-white">
                                        {Math.round(day.temp_max || 0)}°C
                                    </div>
                                    <div className="text-sm text-blue-300 text-right">
                                        <span className="block text-red-300">Max: {Math.round(day.temp_max || 0)}°C</span>
                                        <span className="block text-blue-300">Min: {Math.round(day.temp_min || 0)}°C</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-blue-200 bg-blue-950/50 p-2 rounded-lg">
                                    <span className="text-sm capitalize">Precipitação: {day.precipitation_sum ?? 0}mm</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Droplets className="w-4 h-4 text-blue-400" />
                                        UV: {day.uv_index_max}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Wind className="w-4 h-4 text-slate-400" />
                                        Nascer: {day.sunrise} / Pôr: {day.sunset}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
