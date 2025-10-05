'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { ForgotPasswordView } from './forgot-password.view';
import { RegisterView } from './register.view';
import {useConfig} from "@/app/modules/config/store/config.store";

export const LoginView = () => {
    const { config } = useConfig(state => state);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

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

    if (showForgotPassword) {
        return <ForgotPasswordView onBack={() => setShowForgotPassword(false)} />;
    }

    if (showRegister) {
        return <RegisterView onBackToLogin={() => setShowRegister(false)} />;
    }

    return (
        <div className="flex items-center justify-center bg-white h-screen">
            <div className="p-8 w-full h-screen items-center justify-center flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600"
                            placeholder="email"
                            required
                            disabled={isLoading}
                        />

                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600"
                            placeholder="password"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Connexion...' : 'Login'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="w-full text-center text-sm text-green-600 hover:text-green-400 transition-colors mt-2"
                        disabled={isLoading}
                    >
                        Génerer un nouveau mot de passe
                    </button>
                    {config.allow_visitor_accounts && config.allow_visitor_registration && (
                        <button
                            type="button"
                            onClick={() => setShowRegister(true)}
                            className="w-full text-center text-sm text-green-600 hover:text-green-400 transition-colors mt-2"
                            disabled={isLoading}
                        >
                            Créer un compte visiteur
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}