import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/users', { email, password, role: 'user' });
            setEmail('');
            setPassword('');
            fetchUsers();
        } catch (err) {
            alert('Erro ao criar usuário');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza?")) return;
        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (err) {
            alert('Erro ao deletar');
        }
    }

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">Gerenciar Usuários 👥</h1>

            <Card>
                <CardHeader><CardTitle>Novo Usuário</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="flex gap-4">
                        <Input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit">Criar</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Lista de Usuários</CardTitle></CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {users.map((u: any) => (
                            <li key={u._id} className="flex justify-between items-center p-2 border rounded">
                                <span>{u.email} ({u.role})</span>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(u._id)}>Remover</Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
