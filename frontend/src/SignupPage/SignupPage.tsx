import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    return (
        <div className='flex flex-col justify-center items-center min-h-screen gap-6 blur-bg p-8'>
            <h2 className='text-4xl tracking-widest font-bold'>CREATE AN ACCOUNT</h2>
            <div className='border border-gray-300 p-6 rounded shadow-md w-full max-w-sm'>
                <h2 className='text-2xl mb-4 font-semibold'>Sign Up</h2>
                {error && <p className='text-red-500 mb-4'>{error}</p>}
                <form onSubmit={e => { e.preventDefault(); registerAccount(); }} className='flex flex-col gap-4'>
                    <input 
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className='border border-gray-300 p-2 rounded'
                    />
                    <input 
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className='border border-gray-300 p-2 rounded'
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className='border border-gray-300 p-2 rounded'
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50'
                    >
                        {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignupPage;