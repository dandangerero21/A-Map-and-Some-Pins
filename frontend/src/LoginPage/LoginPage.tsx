import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map } from '@/components/ui/map'
import type MapLibreGL from 'maplibre-gl';

interface User {
    id: number;
    username: string;
    password: string;
    email: string;
}
function Login() {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const [userData, setUserData] = useState<User | null>(null);
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
            const response = await fetch(`http://localhost:8080/users/login`, {
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
            
            setUserData(data);
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
        <div className='flex flex-row min-h-screen gap-8'>
            <div className='flex flex-col w-2/3 justify-center items-center relative overflow-hidden'>
                <h1 className='text-4xl font-bold absolute text-center top-10 z-10 text-white drop-shadow-lg'>
                            A WORLD OF PINS, AWAITING YOUR EXPLORE.
                </h1>
                    <Map 
                        ref={mapRef}
                        center={[-74.0060, 40.7128]} 
                        zoom={6}                        
                        interactive={false}
                        projection={{ type: "globe" }}
                    >
                        
                    </Map>
            </div>

            <div className='flex flex-col justify-center items-center w-1/3 gap-6'>
                <h2 className='text-4xl tracking-widest font-bold'>A MAP AND SOME PINS</h2>
                <div className='border border-gray-300 p-6 rounded shadow-md w-full max-w-sm'>
                    <h2 className='text-2xl mb-4 font-semibold'>Login</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
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
                        <button type='submit' disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 transition-colors duration-300 cursor-pointer">{loading ? 'Logging in...' : 'Login'}</button>
                    </form>
                    <a href="/register" className="text-blue-500 hover:underline mt-4 block text-center">Don't have an account? Register</a>
                </div>
            </div>
        </div>
    );
}

export default Login;