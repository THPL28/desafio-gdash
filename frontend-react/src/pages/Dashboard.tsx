import { useEffect, useState } from "react";
import { BarChart3, CloudRain, Thermometer, Wind, Sun, Cloud, CloudSnow, CloudFog, Zap, Eye, Gauge, Droplets, SunDim } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../api/api";
import { exportCsv, exportXlsx } from "../api/weather";
import WeatherMap from '@/components/WeatherMap';
import Filters from '@/components/Filters';
import WeatherAI from '@/components/WeatherAI';
import Timeline from '@/components/Timeline';

function CustomTooltip(props: { active?: boolean; payload?: any[]; label?: string }) {
  const { active, payload, label } = props;
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0].payload as any;

  return (
    <div className="p-2 bg-[#111827] text-white rounded shadow-lg border border-[#374151] text-sm">
      <div className="font-semibold">{label}</div>
      <div>Temperatura: {item.temp ?? '--'}°C</div>
      <div>Umidade: {item.humidity ?? (item.hum ?? '--')}%</div>
      <div>Vento: {item.wind ?? item.windSpeed ?? '--'} km/h</div>
    </div>
  );
}

export default function Dashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [forecast, setForecast] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const logsRes = await api.get('/weather/logs');
      setLogs(logsRes.data);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err?.message || 'Erro ao buscar dados');
    } finally {
      setLoading(false);
    }
  };

  const current = logs.length > 0 ? logs[0] : null;

  const chartData = logs.slice(0, 20).map((log: any) => ({
    name: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: log.temperature,
    humidity: log.humidity,
    wind: log.windSpeed,
    precipitation: log.precipitationProbability,
  })).reverse();

  const getConditionInfo = (code: number | undefined) => {
    if (code === undefined || code === null) return { text: 'N/A', Icon: Cloud };
    const n = Number(code);
    if (n === 0) return { text: 'Céu Limpo', Icon: Sun };
    if (n === 1) return { text: 'Principalmente Limpo', Icon: Sun };
    if (n === 2) return { text: 'Parcialmente Nublado', Icon: Cloud };
    if (n === 3) return { text: 'Nublado', Icon: Cloud };
    if (n === 45 || n === 48) return { text: 'Neblina', Icon: CloudFog };
    if (n >= 51 && n <= 67) return { text: 'Chuva', Icon: CloudRain };
    if (n >= 71 && n <= 77) return { text: 'Neve', Icon: CloudSnow };
    if (n >= 80 && n <= 82) return { text: 'Chuva Forte', Icon: CloudRain };
    if (n >= 95) return { text: 'Tempestade', Icon: Zap };
    return { text: `Código ${n}`, Icon: Cloud };
  };



  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">

        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-blue-100">Dashboard Climático</h2>

          <div className="flex items-center gap-3">
            <div className="text-sm text-blue-200 mr-4">{current?.city ? `Local: ${current.city}` : ''}</div>
            <Button className="mr-2 bg-blue-600 hover:bg-blue-700" onClick={handleExportCsv}>Exportar CSV</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleExportXlsx}>Exportar XLSX</Button>
          </div>
        </header>

        {loading && (
          <div className="mb-4 text-sm text-blue-300 animate-pulse">Carregando dados...</div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-950/30 border border-red-500/50 text-red-400 rounded">{error}</div>
        )}

        {/* INSIGHTS & SOCIAL */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <WeatherAI city={current?.city || 'São Paulo'} />

          <div className="glass-dark border border-blue-500/20 p-4 rounded-xl bg-blue-950/20">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-100">
              📢 Reportes da Comunidade
            </h3>
            <div className="space-y-2 text-sm">
              <div className="bg-blue-900/20 p-2 rounded flex justify-between border border-blue-500/10">
                <span className="text-blue-200">🌧️ Chuva forte na Zona Sul</span>
                <span className="text-blue-400">10min atrás</span>
              </div>
              <div className="bg-blue-900/20 p-2 rounded flex justify-between border border-blue-500/10">
                <span className="text-blue-200">🌬️ Ventania no Centro</span>
                <span className="text-blue-400">30min atrás</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2 border-blue-500/30 text-blue-200 hover:bg-blue-900/50">Reportar Problema</Button>
            </div>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

          <Card className="glass-dark border border-blue-500/20 bg-blue-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-lg font-medium text-blue-300">
                <Thermometer className="h-5 w-5" /> Temperatura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-50">{current ? `${current.temperature}°C` : "--"}</p>
              <p className="text-xs text-blue-400 mt-1">Sensação: {current?.feelsLike ? `${current.feelsLike}°C` : '--'}</p>
            </CardContent>
          </Card>

          <Card className="glass-dark border border-blue-500/20 bg-blue-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-lg font-medium text-blue-300">
                <Droplets className="h-5 w-5" /> Umidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-50">{current ? `${current.humidity}%` : "--"}</p>
              <p className="text-xs text-blue-400 mt-1">Ponto de orvalho: --</p>
            </CardContent>
          </Card>

          <Card className="glass-dark border border-blue-500/20 bg-blue-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-lg font-medium text-blue-300">
                <Wind className="h-5 w-5" /> Vento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-50">{current ? `${current.windSpeed} km/h` : "--"}</p>
              <p className="text-xs text-blue-400 mt-1">Direção: {current?.windDirection ? `${current.windDirection}°` : '--'}</p>
            </CardContent>
          </Card>

          <Card className="glass-dark border border-blue-500/20 bg-blue-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-lg font-medium text-blue-300">
                <BarChart3 className="h-5 w-5" /> Condição
              </CardTitle>
            </CardHeader>
            <CardContent>
              {current ? (
                <div className="flex items-center gap-4">
                  {(() => {
                    getConditionInfo(current.weatherCode); // Note: check if field name matches backend (weatherCode vs condition)
                    // Actually backend returns 'condition' string, but we might want raw code for icon mapping if available.
                    // weather.service.ts maps code to 'condition' string. 
                    // If we want icon, we need raw code or map from string.
                    // Let's assume 'condition' is string. We might need to adjust getConditionInfo or backend to send code.
                    // Backend sends 'condition' string. 
                    // Let's use a generic icon for now or try to parse.
                    // Ideally backend should send 'weatherCode'.
                    // I added 'raw' field in schema, maybe it's there?
                    // For now, let's use Cloud as default if code missing.
                    const Icon = Cloud;
                    return (
                      <>
                        <Icon className="h-8 w-8 text-blue-200" />
                        <div>
                          <div className="text-lg font-bold text-blue-50">{current.condition}</div>
                          <div className="text-sm text-blue-400">Precipitação: {current.precipitation ?? 0} mm</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <p className="text-xl font-bold text-blue-50">--</p>
              )}
            </CardContent>
          </Card>

        </div>

        {/* SECOND ROW METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="glass-dark border border-blue-500/20 bg-blue-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-lg font-medium text-blue-300">
                <SunDim className="h-5 w-5" /> Índice UV
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-50">{current?.uvIndex ?? '--'}</p>
              <p className="text-xs text-blue-400 mt-1">
                {current?.uvIndex > 8 ? 'Extremo' : current?.uvIndex > 5 ? 'Alto' : 'Moderado/Baixo'}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-dark border border-blue-500/20 bg-blue-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-lg font-medium text-blue-300">
                <Gauge className="h-5 w-5" /> Pressão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-50">{current?.pressure ?? '--'} hPa</p>
            </CardContent>
          </Card>

          <Card className="glass-dark border border-blue-500/20 bg-blue-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-lg font-medium text-blue-300">
                <Eye className="h-5 w-5" /> Visibilidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-50">{current?.visibility ? `${(current.visibility / 1000).toFixed(1)} km` : '--'}</p>
            </CardContent>
          </Card>

          <Card className="glass-dark border border-blue-500/20 bg-blue-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-lg font-medium text-blue-300">
                <CloudFog className="h-5 w-5" /> Qualidade do Ar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* AQI is complex object, let's try to extract a value if available */}
              <p className="text-3xl font-bold text-blue-50">
                {current?.aqi?.results?.[0]?.measurements?.[0]?.value ? current.aqi.results[0].measurements[0].value : '--'}
              </p>
              <p className="text-xs text-blue-400 mt-1">
                {current?.aqi?.results?.[0]?.measurements?.[0]?.parameter ? current.aqi.results[0].measurements[0].parameter.toUpperCase() : 'AQI'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CHART */}
        <div className="mt-6 glass-dark border border-blue-500/20 rounded-xl p-6 h-96 bg-blue-950/20">
          <h3 className="text-lg font-semibold mb-4 text-blue-100">
            Temperatura (Últimas Leituras)
          </h3>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(59, 130, 246, 0.1)"
              />
              <XAxis dataKey="name" stroke="#60a5fa" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#60a5fa"
                strokeWidth={3}
                dot={{ fill: "#60a5fa", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* MAP */}
        <div className="mt-8 glass-dark border border-blue-500/20 rounded-xl p-4 bg-blue-950/20">
          <h3 className="text-lg font-semibold mb-4 text-blue-100">Mapa Interativo (Radar & Satélite)</h3>
          <div className="h-96 rounded-lg overflow-hidden">
            <WeatherMap
              lat={current?.latitude || -23.5505}
              lon={current?.longitude || -46.6333}
              city={current?.city || 'São Paulo'}
              height={380}
            />
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-blue-100">Previsão Detalhada</h3>
          <Filters onForecast={data => setForecast(data)} />
        </div>

        {forecast && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timeline Column */}
            <div className="lg:col-span-1">
              <Timeline data={forecast.timeline} />
            </div>

            {/* Forecast Details Column */}
            <div className="lg:col-span-2 bg-blue-950/30 border border-blue-500/20 p-6 rounded-xl text-blue-100">
              <h2 className="font-semibold text-blue-50 mb-4 text-lg">Resumo da Previsão - {forecast.period}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-blue-300 mb-2">Localização</h3>
                  <div className="space-y-1 text-sm text-blue-100">
                    <p>Lat: {forecast.latitude}</p>
                    <p>Lon: {forecast.longitude}</p>
                    <p>Fuso: {forecast.timezone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-blue-300 mb-2">Próximas Horas</h3>
                  <div className="space-y-2 max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-900/20 pr-2">
                    {forecast.hourly && forecast.hourly.slice(0, 12).map((h: any) => (
                      <div key={h.time} className="flex justify-between items-center border-b border-blue-500/10 py-2 last:border-0">
                        <div className="text-xs text-blue-300 font-mono">
                          {new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-blue-50">{h.temperature ?? '--'}°C</span>
                          <span className="text-xs text-blue-400 flex items-center gap-1">
                            <CloudRain className="w-3 h-3" /> {h.precipitation ?? 0}mm
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

async function handleExportCsv() {
  try {
    const data = await exportCsv();
    downloadBlob(new Blob([data], { type: 'text/csv' }), 'weather_logs.csv');
  } catch (e) {
    console.error('Erro exportando CSV', e);
    alert('Erro ao exportar CSV');
  }
}

async function handleExportXlsx() {
  try {
    const data = await exportXlsx();
    downloadBlob(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'weather_logs.xlsx');
  } catch (e) {
    console.error('Erro exportando XLSX', e);
    alert('Erro ao exportar XLSX');
  }
}
