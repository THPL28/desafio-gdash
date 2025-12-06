import React, { useState } from 'react';
import api from '../api/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { Settings as SettingsIcon, Lock, User } from 'lucide-react';

export default function SettingsPage() {
    const { user } = useAuth();
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            alert('As novas senhas não coincidem.');
            return;
        }

        setLoading(true);
        try {
            await api.patch('/users/me', {
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            alert('Senha atualizada com sucesso!');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar senha. Verifique sua senha atual.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-blue-100 flex items-center gap-3">
                    <SettingsIcon className="text-slate-400" />
                    Configurações
                </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-dark border-blue-500/20 bg-blue-950/20">
                    <CardHeader>
                        <CardTitle className="text-blue-100 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-400" />
                            Perfil
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">Email</label>
                            <div className="p-3 bg-blue-950/50 rounded-lg border border-blue-500/10 text-blue-100">
                                {user?.email || 'Usuário não identificado'}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">Função</label>
                            <div className="p-3 bg-blue-950/50 rounded-lg border border-blue-500/10 text-blue-100 capitalize">
                                {user?.role || 'User'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-dark border-blue-500/20 bg-blue-950/20">
                    <CardHeader>
                        <CardTitle className="text-blue-100 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-yellow-400" />
                            Segurança
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-blue-300">Senha Atual</label>
                                <Input
                                    type="password"
                                    value={passwords.current}
                                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                    className="bg-blue-950/50 border-blue-500/30 text-blue-100"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-blue-300">Nova Senha</label>
                                <Input
                                    type="password"
                                    value={passwords.new}
                                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                    className="bg-blue-950/50 border-blue-500/30 text-blue-100"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-blue-300">Confirmar Nova Senha</label>
                                <Input
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                    className="bg-blue-950/50 border-blue-500/30 text-blue-100"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                {loading ? 'Atualizando...' : 'Alterar Senha'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
