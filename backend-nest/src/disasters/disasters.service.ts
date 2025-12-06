import { Injectable } from '@nestjs/common';
import axios from 'axios';

const mockReliefWeb = {
  data: [
    { id: 1, name: 'Flood in Brazil', date: '2025-12-01', type: 'Flood', country: 'Brazil', url: 'https://reliefweb.int/disaster/flood-brazil' },
    { id: 2, name: 'Earthquake in Chile', date: '2025-11-28', type: 'Earthquake', country: 'Chile', url: 'https://reliefweb.int/disaster/eq-chile' },
  ],
};
const mockFema = {
  disasters: [
    { id: 1001, title: 'Hurricane Ida', state: 'LA', declarationDate: '2025-09-01', type: 'Hurricane' },
    { id: 1002, title: 'Wildfire California', state: 'CA', declarationDate: '2025-08-15', type: 'Fire' },
  ],
};
const mockNws = {
  alerts: [
    { id: 'nws-1', event: 'Severe Thunderstorm Warning', area: 'Texas', sent: '2025-12-06T10:00:00Z' },
    { id: 'nws-2', event: 'Flood Watch', area: 'Amazonas', sent: '2025-12-06T09:00:00Z' },
  ],
};
const mockGdacs = {
  events: [
    { id: 'gdacs-1', type: 'Cyclone', country: 'India', date: '2025-12-05', severity: 'High' },
    { id: 'gdacs-2', type: 'Flood', country: 'Brazil', date: '2025-12-04', severity: 'Moderate' },
  ],
};

const cache = new Map<string, { data: any, ts: number }>();
const TTL = 5 * 60 * 1000; // 5 min

@Injectable()
export class DisastersService {
  // ReliefWeb: https://api.reliefweb.int/
  async fetchReliefWeb(limit = 10) {
    const key = 'reliefweb';
    const now = Date.now();
    if (cache.has(key) && now - cache.get(key).ts < TTL) {
      return cache.get(key).data;
    }
    try {
      const url = `https://api.reliefweb.int/v1/disasters?appname=gdash&limit=${limit}`;
      const res = await axios.get(url, {
        timeout: 10000,
        headers: { 'User-Agent': 'gdash/1.0 (+https://example.org)', Accept: 'application/json' },
      });
      cache.set(key, { data: res.data, ts: now });
      return res.data;
    } catch (err) {
      cache.set(key, { data: mockReliefWeb, ts: now });
      return mockReliefWeb;
    }
  }

  // OpenFEMA: https://www.fema.gov/api/open/v1/
  async fetchOpenFema(limit = 10) {
    const key = 'openfema';
    const now = Date.now();
    if (cache.has(key) && now - cache.get(key).ts < TTL) {
      return cache.get(key).data;
    }
    try {
      const url = `https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?$top=${limit}`;
      const res = await axios.get(url, { timeout: 10000 });
      cache.set(key, { data: res.data, ts: now });
      return res.data;
    } catch (err) {
      cache.set(key, { data: mockFema, ts: now });
      return mockFema;
    }
  }

  // NWS (National Weather Service) alerts: https://api.weather.gov/alerts/active
  async fetchNws(limit = 50) {
    const key = 'nws';
    const now = Date.now();
    if (cache.has(key) && now - cache.get(key).ts < TTL) {
      return cache.get(key).data;
    }
    try {
      const url = `https://api.weather.gov/alerts/active`;
      const res = await axios.get(url, { timeout: 10000, headers: { 'User-Agent': 'gdash/1.0 (+https://example.org)' } });
      cache.set(key, { data: res.data, ts: now });
      return res.data;
    } catch (err) {
      cache.set(key, { data: mockNws, ts: now });
      return mockNws;
    }
  }

  // GDACS: provide raw feed (RSS/XML). We return raw text so client can parse if needed.
  async fetchGdacs() {
    const key = 'gdacs';
    const now = Date.now();
    if (cache.has(key) && now - cache.get(key).ts < TTL) {
      return cache.get(key).data;
    }
    try {
      const url = 'https://www.gdacs.org/gdacsapi/api/events/';
      const res = await axios.get(url, { timeout: 10000 });
      cache.set(key, { data: res.data, ts: now });
      return res.data;
    } catch (err) {
      cache.set(key, { data: mockGdacs, ts: now });
      return mockGdacs;
    }
  }

  // Combined endpoint to aggregate sources
  async fetchCombined() {
    const [relief, fema, nws, gdacs] = await Promise.all([
      this.fetchReliefWeb(10),
      this.fetchOpenFema(10),
      this.fetchNws(50),
      this.fetchGdacs(),
    ]);

    return { relief, openfema: fema, nws, gdacs };
  }
}
