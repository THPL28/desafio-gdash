import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-blue-950/50 border-b border-blue-500/20 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="text-xl font-bold text-blue-100">
                    GDash Weather
                </Link>
            </div>
        </nav>
    );
}