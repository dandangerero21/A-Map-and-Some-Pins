import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map } from '@/components/ui/map'
import type MapLibreGL from 'maplibre-gl';

interface User {
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

    // Animate map movement
    useEffect(() => {
        const interval = setInterval(() => {
            if (!mapRef.current) return;
            
            const map = mapRef.current;
            const center = map.getCenter();
            
            // Move east by 0.5 degrees
            const newLng = center.lng + 0.005;
            // Oscillate latitude
            const newLat = 10 * Math.sin(Date.now() / 3000);
            
            map.easeTo({
                center: [newLng, newLat],
                bearing: map.getBearing() + 0.5,
                pitch: 85, // Tilt angle (0-85 degrees)
                duration: 100,
            });
        }, 50);

        return () => clearInterval(interval);
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
            nav('/dashboard');
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
                <h1 className='text-6xl font-bold absolute text-center top-10 z-10 text-white drop-shadow-lg'>
                            WELCOME BACK
                </h1>
                    <Map 
                        ref={mapRef}
                        center={[-74.0060, 40.7128]} 
                        zoom={6}                        
                        interactive={false}
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
                        <button type='submit' disabled={loading} className="bg-green-300 text-white px-4 py-2 rounded shadow-md hover:bg-green-400 transition-colors duration-300 cursor-pointer">{loading ? 'Logging in...' : 'Login'}</button>
                    </form>
                    <a href="/register" className="text-blue-500 hover:underline mt-4 block text-center">Don't have an account? Register</a>
                </div>
            </div>
        </div>
    );
}

export default Login;