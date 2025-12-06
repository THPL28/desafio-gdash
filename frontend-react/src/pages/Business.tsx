import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, TrendingUp, Users, ShieldCheck, Lock } from 'lucide-react';

export default function BusinessPage() {
    return (
        <div className="p-6 space-y-8">
            <header className="text-center max-w-2xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4 border border-blue-500/20">
                    <TrendingUp className="w-4 h-4" />
                    GDash Business
                </div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-cyan-300 mb-4">
                    Inteligência Climática para sua Empresa
                </h1>
                <p className="text-blue-200 text-lg">
                    Tome decisões estratégicas baseadas em dados meteorológicos precisos e insights de IA.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-dark border-blue-500/20 bg-blue-950/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-blue-100">
                            <BarChart className="text-cyan-400" />
                            Analytics Avançado
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-400 mb-6">
                            Dashboards customizáveis com histórico de 10 anos e projeções de impacto no seu negócio.
                        </p>
                        <div className="h-32 bg-blue-950/50 rounded-lg border border-blue-500/10 flex items-center justify-center text-xs text-slate-500">
                            [Gráfico de Demonstração]
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-dark border-blue-500/20 bg-blue-950/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-blue-100">
                            <ShieldCheck className="text-purple-400" />
                            Gestão de Risco
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-400 mb-6">
                            Alertas antecipados de eventos extremos configurados especificamente para suas operações.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-red-300 bg-red-950/20 p-2 rounded border border-red-500/20">
                                <Lock className="w-3 h-3" /> Alerta de Tempestade (Demo)
                            </div>
                            <div className="flex items-center gap-2 text-sm text-yellow-300 bg-yellow-950/20 p-2 rounded border border-yellow-500/20">
                                <Lock className="w-3 h-3" /> Risco de Granizo (Demo)
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-dark border-blue-500/20 bg-blue-950/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-blue-100">
                            <Users className="text-emerald-400" />
                            Multi-usuários
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-400 mb-6">
                            Gerencie acesso de times inteiros com permissões granulares e logs de auditoria.
                        </p>
                        <Button className="w-full bg-blue-600 hover:bg-blue-500">
                            Falar com Vendas
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
