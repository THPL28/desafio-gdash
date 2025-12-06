import WeatherMap from '../components/WeatherMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MapPage() {
    return (
        <div className="p-6 space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-blue-100">Mapa Interativo Global</h1>
                <p className="text-blue-300 mt-2">Visualize dados meteorológicos, precipitação e nuvens em tempo real.</p>
            </header>

            <Card className="glass-dark border-blue-500/20 bg-blue-950/20">
                <CardHeader>
                    <CardTitle className="text-blue-100">Visualização de Satélite</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-hidden rounded-b-xl">
                    <WeatherMap height={600} />
                </CardContent>
            </Card>
        </div>
    );
}
