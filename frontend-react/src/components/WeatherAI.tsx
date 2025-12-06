import { useEffect, useState, useRef } from 'react';
import { Sparkles, Send, Bot, User } from 'lucide-react';
import api from '../api/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WeatherAIProps {
    city: string;
}

interface Message {
    role: 'ai' | 'user';
    text: string;
}

export default function WeatherAI({ city }: WeatherAIProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchInitialSummary();
    }, [city]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchInitialSummary = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/weather/ai-summary?city=${city}`);
            setMessages([{ role: 'ai', text: res.data.text }]);
        } catch (error) {
            setMessages([{ role: 'ai', text: "Não foi possível conectar à IA do clima." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const question = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: question }]);
        setLoading(true);

        try {
            const res = await api.get(`/weather/ai-summary?city=${city}&question=${encodeURIComponent(question)}`);
            setMessages(prev => [...prev, { role: 'ai', text: res.data.text }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', text: "Desculpe, não consegui processar sua pergunta." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-dark border border-blue-500/20 rounded-xl p-4 bg-blue-950/20 flex flex-col h-[400px]">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-100">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                Assistente Climático (IA)
            </h3>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-900/20"
            >
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center shrink-0
                            ${msg.role === 'ai' ? 'bg-blue-600' : 'bg-slate-600'}
                        `}>
                            {msg.role === 'ai' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                        </div>
                        <div className={`
                            p-3 rounded-lg text-sm max-w-[80%]
                            ${msg.role === 'ai'
                                ? 'bg-blue-900/40 text-blue-100 border border-blue-500/20'
                                : 'bg-slate-700/50 text-slate-100 border border-slate-500/20'}
                        `}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 animate-pulse">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-blue-900/40 p-3 rounded-lg text-sm text-blue-300 border border-blue-500/20">
                            Digitando...
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-2 mt-auto">
                <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Pergunte sobre o clima..."
                    className="bg-blue-950/50 border-blue-500/30 text-blue-100 placeholder:text-blue-400/50"
                />
                <Button onClick={handleSend} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
