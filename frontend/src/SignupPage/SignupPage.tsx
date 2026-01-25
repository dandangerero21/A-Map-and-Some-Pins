import { useState , useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map } from '@/components/ui/map'
import type MapLibreGL from 'maplibre-gl';

interface User {
    username: string;
    password: string;
    email: string;
}

function SignupPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const mapRef = useRef<MapLibreGL.Map>(null);

    const registerAccount = async () => {
        if(!username.trim() || !password.trim() || !email.trim()) {
            setError('Please fill in all fields.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }),
            });
            
            if(response.status === 500){
                setError('Username or email already exists.');
                return;
            }

            if (response.ok) {

                nav('/');
            } else {
                const data = await response.json();
                setError(data.message || 'Registration failed.');
            }
        } catch (error) {
            setError('An error occurred during registration. Please try again.');
        } finally {
            setLoading(false);
        }
    }

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

    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 blur-sm">
                <Map
                    ref={mapRef}
                    center={[-74.006, 40.7128]}
                    zoom={6}
                    interactive={false}
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/45" />
            <div className="relative z-10 flex flex-col justify-center items-center min-h-screen gap-6 p-8 text-white">
                <h2 className="text-4xl tracking-widest font-bold">CREATE AN ACCOUNT</h2>
                <div className="w-full max-w-sm rounded bg-white p-8 shadow-md backdrop-blur-md text-gray-900">
                    <h2 className="text-2xl mb-4 font-semibold text-center">Sign Up</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            registerAccount();
                        }}
                        className="flex flex-col gap-4"
                    >
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className='border p-4 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400'
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className='border p-4 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400'
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className='border p-4 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400'
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 transition-colors duration-300 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'Registering...' : 'Sign Up'}
                        </button>
                    </form>

                    <a href="/" className="text-blue-500 hover:underline mt-4 block text-center">
                        Already have an account? Log in
                    </a>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;