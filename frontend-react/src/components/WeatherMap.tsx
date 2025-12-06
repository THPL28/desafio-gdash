import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface WeatherMapProps {
    lat?: number;
    lon?: number;
    city?: string;
    height?: number;
}

export default function WeatherMap({ lat = -23.5505, lon = -46.6333, city = 'São Paulo', height = 400 }: WeatherMapProps) {
    return (
        <MapContainer center={[lat, lon]} zoom={10} scrollWheelZoom={false} style={{ height: `${height}px`, width: '100%', borderRadius: '0.75rem' }}>
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Dark Mode">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                </LayersControl.BaseLayer>

                <LayersControl.Overlay name="Precipitation (RainViewer)">
                    <TileLayer
                        url="https://tile.rainviewer.com/img/radar_nowcast_10min/256/{z}/{x}/{y}/2/1_1.png"
                        attribution="RainViewer"
                        opacity={0.6}
                    />
                </LayersControl.Overlay>

                <LayersControl.Overlay name="Clouds (OpenWeatherMap)">
                    <TileLayer
                        url="https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY"
                        attribution="OpenWeatherMap"
                        opacity={0.5}
                    />
                </LayersControl.Overlay>
            </LayersControl>

            <Marker position={[lat, lon]}>
                <Popup>
                    {city}
                </Popup>
            </Marker>
        </MapContainer>
    );
}
