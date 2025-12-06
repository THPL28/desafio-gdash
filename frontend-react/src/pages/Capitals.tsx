import { useState } from 'react';
import { MapPin, Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import api from '../api/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherData {
    city: string;
    temperature: number;
    condition: string;
    humidity?: number;
    windSpeed?: number;
    visibility?: number;
    feelsLike?: number;
}

const BRAZILIAN_CAPITALS = [
    'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza',
    'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre',
    'Belém', 'Goiânia', 'Guarulhos', 'Campinas', 'São Luís',
    'São Gonçalo', 'Maceió', 'Duque de Caxias', 'Natal', 'Teresina',
    'Campo Grande', 'João Pessoa', 'Jaboatão dos Guararapes', 'Santo André', 'São Bernardo do Campo',
    'Osasco', 'Ribeirão Preto'
];

export default function CapitalsPage() {
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCityClick = async (city: string) => {
        setSelectedCity(city);
        setLoading(true);
        try {
            const response = await api.get(`/weather?city=${encodeURIComponent(city)}`);
            setWeatherData(response.data);
        } catch (error) {
            console.error('Error fetching weather:', error);
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-blue-100 flex items-center gap-3">
                    <MapPin className="text-blue-500" />
                    Capitais do Brasil
                </h1>
                <p className="text-blue-300 mt-2">Clique em uma capital para ver informações climáticas em tempo real.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* City Cards */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {BRAZILIAN_CAPITALS.map(city => (
                            <Card
                                key={city}
                                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${selectedCity === city
                                        ? 'bg-blue-600 border-blue-400'
                                        : 'bg-blue-950/20 border-blue-500/20 hover:bg-blue-950/40'
                                    }`}
                                onClick={() => handleCityClick(city)}
                            >
                                <CardContent className="p-4 text-center">
                                    <MapPin className={`w-6 h-6 mx-auto mb-2 ${selectedCity === city ? 'text-white' : 'text-blue-400'
                                        }`} />
                                    <p className={`text-sm font-semibold ${selectedCity === city ? 'text-white' : 'text-blue-100'
                                        }`}>
                                        {city}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Weather Details Panel */}
                <div className="lg:col-span-1">
                    {!selectedCity && (
                        <Card className="glass-dark border-blue-500/20 bg-blue-950/20 h-full flex items-center justify-center">
                            <CardContent className="text-center p-6">
                                <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-4 opacity-50" />
                                <p className="text-blue-300">Selecione uma capital para ver o clima</p>
                            </CardContent>
                        </Card>
                    )}

                    {selectedCity && loading && (
                        <Card className="glass-dark border-blue-500/20 bg-blue-950/20">
                            <CardContent className="text-center p-6">
                                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="text-blue-300">Carregando dados de {selectedCity}...</p>
                            </CardContent>
                        </Card>
                    )}

                    {selectedCity && !loading && weatherData && (
                        <Card className="glass-dark border-blue-500/20 bg-blue-950/20 sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-blue-100 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-400" />
                                    {weatherData.city}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center py-4">
                                    <div className="text-5xl font-bold text-blue-100">
                                        {weatherData.temperature}°C
                                    </div>
                                    <p className="text-blue-300 mt-2">{weatherData.condition}</p>
                                </div>

                                <div className="space-y-3 border-t border-blue-500/20 pt-4">
                                    {weatherData.feelsLike && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-blue-300">
                                                <Thermometer className="w-4 h-4" />
                                                <span className="text-sm">Sensação</span>
                                            </div>
                                            <span className="text-blue-100 font-semibold">{weatherData.feelsLike}°C</span>
                                        </div>
                                    )}

                                    {weatherData.humidity !== undefined && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-blue-300">
                                                <Droplets className="w-4 h-4" />
                                                <span className="text-sm">Umidade</span>
                                            </div>
                                            <span className="text-blue-100 font-semibold">{weatherData.humidity}%</span>
                                        </div>
                                    )}

                                    {weatherData.windSpeed !== undefined && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-blue-300">
                                                <Wind className="w-4 h-4" />
                                                <span className="text-sm">Vento</span>
                                            </div>
                                            <span className="text-blue-100 font-semibold">{weatherData.windSpeed} km/h</span>
                                        </div>
                                    )}

                                    {weatherData.visibility !== undefined && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-blue-300">
                                                <Eye className="w-4 h-4" />
                                                <span className="text-sm">Visibilidade</span>
                                            </div>
                                            <span className="text-blue-100 font-semibold">
                                                {(weatherData.visibility / 1000).toFixed(1)} km
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {selectedCity && !loading && !weatherData && (
                        <Card className="glass-dark border-red-500/20 bg-red-950/20">
                            <CardContent className="text-center p-6">
                                <p className="text-red-300">Erro ao carregar dados de {selectedCity}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
