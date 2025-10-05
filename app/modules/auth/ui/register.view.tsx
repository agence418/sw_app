'use client';

import {useState} from 'react';

interface RegisterViewProps {
    onBackToLogin: () => void;
}

export const RegisterView = ({onBackToLogin}: RegisterViewProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Une erreur est survenue lors de l\'enregistrement');
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                onBackToLogin();
            }, 2000);
        } catch (error) {
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center bg-white h-screen">
                <div className="p-8 w-full h-screen items-center justify-center flex flex-col">
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        Enregistrement réussi ! Redirection vers la page de connexion...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center bg-white h-screen">
            <div className="p-8 w-full h-screen items-center justify-center flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-center">Inscription</h2>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium">Nom</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600"
                            placeholder="Nom complet"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600"
                            placeholder="email@example.com"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600"
                            placeholder="Mot de passe (min. 6 caractères)"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirmer le mot de
                            passe</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600"
                            placeholder="Confirmer le mot de passe"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Inscription...' : 'Créer un compte visiteur'}
                    </button>
                    <button
                        type="button"
                        onClick={onBackToLogin}
                        className="w-full text-center text-sm text-green-600 hover:text-green-400 transition-colors mt-2"
                        disabled={isLoading}
                    >
                        Déjà inscrit ? Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
}