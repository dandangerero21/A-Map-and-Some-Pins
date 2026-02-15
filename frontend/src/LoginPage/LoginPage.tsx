import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Map } from '@/components/ui/map'
import type MapLibreGL from 'maplibre-gl';
function Login() {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const mapRef = useRef<MapLibreGL.Map>(null);

    useEffect(() => {
        let animationId: number;
        let prevTime: number | null = null;
        let lng = -74.006;

        const animate = (time: number) => {
            if (!mapRef.current) {
                animationId = requestAnimationFrame(animate);
                return;
            }
            if (prevTime === null) prevTime = time;
            const delta = (time - prevTime) / 1000; // seconds
            prevTime = time;

            // Drift eastward at ~3°/sec
            lng += delta * 3;
            // Gentle latitude wave between ~-30° and ~30°
            const lat = 20 * Math.sin(lng * 0.02);
            // Slow bearing drift
            const bearing = 15 * Math.sin(lng * 0.008);
            // Gentle pitch oscillation
            const pitch = 45 + 10 * Math.sin(lng * 0.012);

            mapRef.current.jumpTo({
                center: [lng, lat],
                bearing,
                pitch,
                zoom: 6,
            });

            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, []);

    const findAccount = async () => {

        if(!usernameOrEmail.trim() || !password.trim()) {
            setError('Please enter both credentials.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Verify password with backend (send username/email + password)
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usernameOrEmail: usernameOrEmail,
                    password: password,
                }),
            });
            
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const data = await response.json();
            
            nav('/dashboard', { state: { userData: data } });
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid username or password.');
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        findAccount();
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="fixed inset-0 blur-sm">
                <Map 
                    ref={mapRef}
                    center={[-74.0060, 40.7128]} 
                    zoom={6}                        
                    interactive={false}
                    projection={{ type: "globe" }}
                >
                </Map>
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/45" />
            <div className="relative z-10 flex flex-col justify-center items-center min-h-screen gap-6 p-8 text-white">
                <h1 className='text-3xl sm:text-4xl font-bold text-center drop-shadow-lg'>
                    A WORLD OF PINS, AWAITING YOUR EXPLORE.
                </h1>
                <h2 className='text-2xl sm:text-4xl tracking-widest font-bold'>A MAP AND SOME PINS</h2>
                <div className='w-full max-w-sm rounded bg-white p-8 shadow-md backdrop-blur-md text-gray-900'>
                    <h2 className='text-2xl mb-4 font-semibold text-center'>Login</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Username or Email"
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                            className='border p-4 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400'
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='border p-4 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400'
                        />
                        <button type='submit' disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 transition-colors duration-300 cursor-pointer disabled:opacity-50">{loading ? 'Logging in...' : 'Login'}</button>
                    </form>
                    <Link to="/register" className="text-blue-500 hover:underline mt-4 block text-center">
                        Don't have an account? Register
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;