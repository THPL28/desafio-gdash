import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, CloudRain, Briefcase, Settings, Users, Sun, Menu, X, MapPinned } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: MapPinned, label: 'Capitais do Brasil', path: '/capitals' },
        { icon: Map, label: 'Mapa Interativo', path: '/map' },
        { icon: CloudRain, label: 'Previsão Detalhada', path: '/forecast' },
        { icon: Users, label: 'Comunidade', path: '/social' },
        { icon: Briefcase, label: 'Business (SaaS)', path: '/business' },
        { icon: Sun, label: 'Pokémon', path: '/pokemon' },
        { icon: Settings, label: 'Configurações', path: '/settings' },
        { icon: CloudRain, label: 'Desastres', path: '/disasters' },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-blue-100 bg-blue-950/50">
                    {isOpen ? <X /> : <Menu />}
                </Button>
            </div>

            {/* Sidebar Container */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-950/95 border-r border-blue-500/20 backdrop-blur-xl transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="flex flex-col h-full p-4">
                    <div className="flex items-center gap-2 px-4 py-6 mb-6">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <CloudRain className="text-white w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                            GDash Weather
                        </h1>
                    </div>

                    <nav className="space-y-2 flex-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                        ${isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                            : 'text-slate-400 hover:bg-blue-500/10 hover:text-blue-200'
                                        }
                                    `}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 mt-auto">
                        <div className="bg-gradient-to-br from-blue-900/50 to-slate-900/50 rounded-xl p-4 border border-blue-500/20">
                            <h4 className="text-sm font-semibold text-blue-200 mb-1">Pro Version</h4>
                            <p className="text-xs text-slate-400 mb-3">Desbloqueie recursos avançados de IA e Business.</p>
                            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-500 text-xs">
                                Upgrade
                            </Button>
                        </div>

                        <div className="mt-4 pt-4 border-t border-blue-500/20">
                            <Link
                                to="/users"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-blue-500/10 hover:text-blue-200 rounded-xl transition-all duration-200"
                            >
                                <Users className="w-5 h-5 text-slate-500 group-hover:text-blue-400" />
                                <span className="font-medium">Gerenciar Usuários</span>
                            </Link>
                            <Link
                                to="/login"
                                onClick={() => {
                                    setIsOpen(false);
                                    localStorage.removeItem('token');
                                    window.location.href = '/login';
                                }}
                                className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                                <span className="font-medium">Sair</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
