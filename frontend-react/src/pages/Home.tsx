import { useState } from "react";
import { fetchWeather } from "../api/weather";

export default function Home() {
  const [city, setCity] = useState("Lisboa");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setWeather(null);

    const data = await fetchWeather(city);

    if (!data) {
      setError("Erro ao buscar clima.");
    } else {
      setWeather(data);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Consulta de Tempo ☁️</h1>

      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Digite uma cidade"
        style={{
          padding: 8,
          fontSize: 18,
          marginRight: 10,
        }}
      />

      <button onClick={handleSearch} style={{ padding: "10px 15px", fontSize: 16 }}>
        Buscar
      </button>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: 20, padding: 15, border: "1px solid #ccc" }}>
          <h2>Resultado</h2>
          <pre>{JSON.stringify(weather, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
