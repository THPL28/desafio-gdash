import { useState } from 'react';
import api from '../api/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function Filters({ onForecast }: { onForecast?: (data: any) => void }) {
  const [city, setCity] = useState('São Paulo');
  const [period, setPeriod] = useState<'hourly' | 'daily' | 'weekly'>('hourly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchForecast() {
    setLoading(true);
    setError(null);
    try {
      // Use api instance to leverage proxy and base URL
      const res = await api.get('/weather/forecast', {
        params: { city, period }
      });
      if (onForecast) onForecast(res.data);
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || "Erro ao buscar previsão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-dark p-6 rounded-xl border border-white/10 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Cidade</label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={city}
              onChange={e => setCity(e.target.value)}
              className="pl-8 bg-secondary/50 border-white/10"
              placeholder="Ex: São Paulo"
            />
          </div>
        </div>

        <div className="w-full md:w-48 space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Período</label>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value as any)}
            className="w-full h-10 px-3 rounded-md border border-white/10 bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="hourly">Horário (24h)</option>
            <option value="daily">Diário (7d)</option>
            <option value="weekly">Semanal (14d)</option>
          </select>
        </div>

        <Button
          onClick={fetchForecast}
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>}
    </div>
  );
}
