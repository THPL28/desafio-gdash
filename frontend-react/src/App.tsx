import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import PokemonPage from './pages/Pokemon';
import SocialPage from './pages/Social';
import CapitalsPage from './pages/Capitals';
import Layout from './components/Layout';
import MapPage from './pages/Map';
import ForecastPage from './pages/Forecast';
import BusinessPage from './pages/Business';
import SettingsPage from './pages/Settings';
import DisastersPage from './pages/Disasters';



const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex h-screen items-center justify-center text-blue-400">Carregando...</div>;
    return user ? children : <Navigate to="/login" />;
};

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes wrapped in Layout */}
                    <Route element={
                        <PrivateRoute>
                            <Layout />
                        </PrivateRoute>
                    }>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/pokemon" element={<PokemonPage />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/capitals" element={<CapitalsPage />} />
                        <Route path="/map" element={<MapPage />} />
                        <Route path="/forecast" element={<ForecastPage />} />
                        <Route path="/social" element={<SocialPage />} />
                        <Route path="/business" element={<BusinessPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/disasters" element={<DisastersPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
