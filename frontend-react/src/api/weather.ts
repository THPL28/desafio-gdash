// src/api/weather.service.ts
import api from "./api";

export async function fetchWeather(city: string) {
  try {
    const response = await api.get("/weather", {
      params: { city },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clima:", error);
    return null;
  }
}

export async function getLogs() {
  return api.get("/weather/logs").then((r) => r.data);
}

export async function getInsights() {
  return api.get("/weather/insights").then((r) => r.data);
}

export async function exportCsv() {
  const resp = await api.get('/weather/export/csv', { responseType: 'blob' });
  return resp.data;
}

export async function exportXlsx() {
  const resp = await api.get('/weather/export/xlsx', { responseType: 'blob' });
  return resp.data;
}
