import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '@/api/api';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon paths (Leaflet + Vite)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
});

export default function MapView({ height = 400 }: { height?: number }) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get('/weather/logs');
        if (!mounted) return;
        setLogs(res.data || []);
      } catch (err) {
        console.error('Error loading logs for map', err);
      }
    })();
    return () => { mounted = false };
  }, []);

  const defaultCenter: [number, number] = [-23.5505, -46.6333];

  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <MapContainer center={defaultCenter} zoom={10} style={{ height: height, width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* RainViewer Radar Overlay */}
        <TileLayer
          attribution='Radar data &copy; <a href="https://www.rainviewer.com/api.html">RainViewer</a>'
          url="https://tile.rainviewer.com/img/radar_nowcast_png/256/{z}/{x}/{y}/2/1_1.png"
          opacity={0.6}
        />

        {logs.map((l, idx) => {
          const lat = l.latitude ?? l.lat ?? parseFloat(l.latitude || 0);
          const lon = l.longitude ?? l.lon ?? parseFloat(l.longitude || 0);
          if (!lat || !lon) return null;
          return (
            <Marker key={idx} position={[Number(lat), Number(lon)]}>
              <Popup>
                <div className="text-sm">
                  <div><strong>{l.city ?? 'Local'}</strong></div>
                  <div>Temp: {l.temperature ?? '--'}°C</div>
                  <div>Umidade: {l.humidity ?? '--'}%</div>
                  <div>Vento: {l.windSpeed ?? '--'} km/h</div>
                  <div>Horário: {new Date(l.createdAt).toLocaleString()}</div>
                </div>
              </Popup>
            </Marker>
          )
        })}

      </MapContainer>
    </div>
  );
}
