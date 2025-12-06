import { useEffect, useState } from 'react';
import { MapPin, ThumbsUp, AlertTriangle, CloudRain, Wind, Zap, Droplets } from 'lucide-react';
import api from '../api/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';

interface Report {
    _id: string;
    type: string;
    description: string;
    city: string;
    likes: number;
    createdAt: string;
    userId: string;
}

const REPORT_TYPES = [
    { value: 'alagamento', label: 'Alagamento', icon: Droplets, color: 'text-blue-400' },
    { value: 'vento', label: 'Vento Forte', icon: Wind, color: 'text-slate-400' },
    { value: 'energia', label: 'Queda de Energia', icon: Zap, color: 'text-yellow-400' },
    { value: 'chuva', label: 'Chuva Forte', icon: CloudRain, color: 'text-indigo-400' },
];

export default function SocialPage() {
    const { user } = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [newReport, setNewReport] = useState({ type: '', description: '', city: 'São Paulo' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await api.get('/social/reports');
            setReports(res.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!newReport.type || !newReport.description) return;
        setSubmitting(true);
        try {
            await api.post('/social/reports', {
                ...newReport,
                userId: user?.email || 'anonymous',
                latitude: -23.5505, // Mock coords for now
                longitude: -46.6333
            });
            setNewReport({ type: '', description: '', city: 'São Paulo' });
            fetchReports();
        } catch (error) {
            console.error('Error submitting report:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (id: string) => {
        try {
            await api.put(`/social/reports/${id}/like`);
            fetchReports();
        } catch (error) {
            console.error('Error liking report:', error);
        }
    };

    const getTypeInfo = (type: string) => REPORT_TYPES.find(t => t.value === type) || REPORT_TYPES[0];

    return (
        <div className="p-6 space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-blue-100 flex items-center gap-3">
                    <AlertTriangle className="text-yellow-500" />
                    Central da Comunidade
                </h1>
                <p className="text-blue-300 mt-2">Reporte e acompanhe incidentes climáticos em tempo real.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Submit Form */}
                <Card className="glass-dark border-blue-500/20 bg-blue-950/20 h-fit">
                    <CardHeader>
                        <CardTitle className="text-blue-100">Novo Reporte</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-blue-300">Tipo de Incidente</label>
                            <Select
                                value={newReport.type}
                                onValueChange={(v: string) => setNewReport({ ...newReport, type: v })}
                            >
                                <SelectTrigger className="bg-blue-950/50 border-blue-500/30 text-blue-100">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {REPORT_TYPES.map(t => (
                                        <SelectItem key={t.value} value={t.value}>
                                            <div className="flex items-center gap-2">
                                                <t.icon className={`w-4 h-4 ${t.color}`} />
                                                {t.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-blue-300">Descrição</label>
                            <Input
                                value={newReport.description}
                                onChange={e => setNewReport({ ...newReport, description: e.target.value })}
                                placeholder="Ex: Rua alagada na altura do nº 100"
                                className="bg-blue-950/50 border-blue-500/30 text-blue-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-blue-300">Cidade</label>
                            <Input
                                value={newReport.city}
                                onChange={e => setNewReport({ ...newReport, city: e.target.value })}
                                className="bg-blue-950/50 border-blue-500/30 text-blue-100"
                            />
                        </div>

                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={handleSubmit}
                            disabled={submitting || !newReport.type || !newReport.description}
                        >
                            {submitting ? 'Enviando...' : 'Reportar'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Reports Feed */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold text-blue-100 mb-4">Últimos Reportes</h2>

                    {loading ? (
                        <div className="text-blue-400 text-center py-8">Carregando reportes...</div>
                    ) : reports.length === 0 ? (
                        <div className="text-slate-500 text-center py-8 bg-blue-950/10 rounded-xl border border-blue-500/10">
                            Nenhum reporte recente. A comunidade está tranquila!
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {reports.map(report => {
                                const info = getTypeInfo(report.type);
                                const Icon = info.icon;
                                return (
                                    <div key={report._id} className="glass-dark border border-blue-500/10 rounded-xl p-4 bg-blue-950/10 hover:bg-blue-950/20 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-4">
                                                <div className={`w-10 h-10 rounded-full bg-blue-950 flex items-center justify-center border border-blue-500/20`}>
                                                    <Icon className={`w-5 h-5 ${info.color}`} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-blue-100 flex items-center gap-2">
                                                        {info.label}
                                                        <span className="text-xs font-normal text-slate-400">• {new Date(report.createdAt).toLocaleTimeString()}</span>
                                                    </h3>
                                                    <p className="text-blue-200 mt-1">{report.description}</p>
                                                    <div className="flex items-center gap-2 mt-2 text-xs text-blue-400">
                                                        <MapPin className="w-3 h-3" />
                                                        {report.city}
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-slate-400 hover:text-blue-400 hover:bg-blue-900/20 gap-1"
                                                onClick={() => handleLike(report._id)}
                                            >
                                                <ThumbsUp className="w-4 h-4" />
                                                {report.likes}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
