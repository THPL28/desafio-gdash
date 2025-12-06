import { Sun, Moon, CloudRain, Thermometer } from 'lucide-react';

interface TimelineProps {
    data: {
        sunrise?: string;
        sunset?: string;
        peakTemp?: { time: string; value: number };
        rainWindow?: { start: string; end: string };
    };
}

export default function Timeline({ data }: TimelineProps) {
    if (!data) return null;

    const events = [
        { time: data.sunrise, icon: Sun, label: 'Nascer do Sol', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { time: data.peakTemp?.time, icon: Thermometer, label: `Pico de Calor (${data.peakTemp?.value}°C)`, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { time: data.rainWindow?.start, icon: CloudRain, label: 'Previsão de Chuva', color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { time: data.sunset, icon: Moon, label: 'Pôr do Sol', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    ].filter(e => e.time).sort((a, b) => (a.time! > b.time! ? 1 : -1));

    return (
        <div className="glass-dark border border-blue-500/20 rounded-xl p-6 bg-blue-950/20">
            <h3 className="text-lg font-semibold mb-6 text-blue-100 flex items-center gap-2">
                <Sun className="w-5 h-5 text-yellow-400" />
                Linha do Tempo (Hoje)
            </h3>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-500/20" />

                <div className="space-y-6">
                    {events.map((event, index) => (
                        <div key={index} className="relative flex items-center gap-4 pl-10 group">
                            {/* Dot on line */}
                            <div className={`absolute left-[13px] w-2.5 h-2.5 rounded-full ${event.color.replace('text-', 'bg-')} ring-4 ring-slate-950 group-hover:scale-125 transition-transform`} />

                            {/* Time */}
                            <div className="text-sm font-mono text-blue-300 w-16">
                                {new Date(event.time!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>

                            {/* Card */}
                            <div className={`flex-1 flex items-center gap-3 p-3 rounded-lg border border-white/5 ${event.bg} hover:bg-opacity-20 transition-colors`}>
                                <event.icon className={`w-5 h-5 ${event.color}`} />
                                <span className="text-blue-100 font-medium">{event.label}</span>
                            </div>
                        </div>
                    ))}

                    {events.length === 0 && (
                        <div className="text-center text-blue-400 py-4">
                            Nenhum evento significativo previsto para hoje.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
