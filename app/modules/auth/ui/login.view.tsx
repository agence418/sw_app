'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export const LoginView = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Email ou mot de passe incorrect');
            }
        } catch (error) {
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 h-screen">
            <div className="bg-green-400 p-8 rounded shadow-md w-full h-screen items-center justify-center flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="email"
                            required
                            disabled={isLoading}
                        />

                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="password"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Connexion...' : 'Login'}
                    </button>
                </form>
                <div className="mt-4 text-sm text-gray-600 text-center">
                    <div className="bg-gray-50 p-3 rounded">
                        <p className="mb-2"><strong>Admin:</strong></p>
                        <p className="font-mono text-xs">admin@startupweekend.com / admin2025</p>
                        
                        <p className="mt-3 mb-2"><strong>Coachs:</strong></p>
                        <p className="font-mono text-xs">coach1@startupweekend.com / coach2025</p>
                        <p className="font-mono text-xs">coach2@startupweekend.com / coach2025</p>
                    </div>
                </div>
            </div>
        </div>
    );
}