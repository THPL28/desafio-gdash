import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DisastersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/disasters/combined').then(res => {
      setData(res.data || res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-blue-100 mb-4">Monitoramento de Desastres Naturais</h1>
      {loading && <div className="text-blue-400">Carregando...</div>}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ReliefWeb */}
          {data.relief?.data?.map((d: any) => (
            <Card key={d.id} className="glass-dark border-red-500/20 bg-red-950/20">
              <CardHeader>
                <CardTitle className="text-red-100">{d.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div>Tipo: {d.type}</div>
                <div>País: {d.country}</div>
                <div>Data: {d.date}</div>
                <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Ver mais</a>
              </CardContent>
            </Card>
          ))}
          {/* FEMA */}
          {data.openfema?.disasters?.map((d: any) => (
            <Card key={d.id} className="glass-dark border-yellow-500/20 bg-yellow-950/20">
              <CardHeader>
                <CardTitle className="text-yellow-100">{d.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div>Tipo: {d.type}</div>
                <div>Estado: {d.state}</div>
                <div>Data: {d.declarationDate}</div>
              </CardContent>
            </Card>
          ))}
          {/* NWS */}
          {data.nws?.alerts?.map((a: any) => (
            <Card key={a.id} className="glass-dark border-blue-500/20 bg-blue-950/20">
              <CardHeader>
                <CardTitle className="text-blue-100">{a.event}</CardTitle>
              </CardHeader>
              <CardContent>
                <div>Área: {a.area}</div>
                <div>Enviado: {a.sent}</div>
              </CardContent>
            </Card>
          ))}
          {/* GDACS */}
          {data.gdacs?.events?.map((e: any) => (
            <Card key={e.id} className="glass-dark border-green-500/20 bg-green-950/20">
              <CardHeader>
                <CardTitle className="text-green-100">{e.type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div>País: {e.country}</div>
                <div>Data: {e.date}</div>
                <div>Severidade: {e.severity}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {!loading && !data && <div className="text-red-400">Não foi possível carregar dados de desastres.</div>}
    </div>
  );
}
