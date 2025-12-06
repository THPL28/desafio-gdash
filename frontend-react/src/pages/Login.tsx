import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { CloudSun } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.access_token, { email });
            navigate('/dashboard');
        } catch (err) {
            setError('Falha no login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1516912481808-5406353a7dd0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 blur-sm"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"></div>

            <Card className="w-[400px] z-10 glass-dark border-white/10 shadow-2xl">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg transform rotate-3">
                        <CloudSun size={32} />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Bem-vindo ao GDASH</CardTitle>
                        <CardDescription>Entre para acessar o monitoramento climático</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-secondary/50 border-white/10 focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-secondary/50 border-white/10 focus:border-primary"
                            />
                        </div>
                        {error && <p className="text-destructive text-sm text-center">{error}</p>}
                        <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                            {loading ? 'Entrando...' : 'Acessar Plataforma'}
                        </Button>
                    </form>
                    <div className="mt-6 text-center text-xs text-muted-foreground">
                        <p>Credenciais padrão: admin@example.com / admin123456</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
