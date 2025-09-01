'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import '../global.css';

function ResetPasswordComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [tokenValid, setTokenValid] = useState<boolean | null>(null);

    useEffect(() => {
        if (!token) {
            setTokenValid(false);
            return;
        }

        // Vérifier la validité du token
        const verifyToken = async () => {
            try {
                const response = await fetch(`/api/auth/verify-reset-token?token=${token}`);
                setTokenValid(response.ok);
            } catch (error) {
                setTokenValid(false);
            }
        };

        verifyToken();
    }, [token]);

    const validatePassword = (password: string): string | null => {
        if (password.length < 8) {
            return 'Le mot de passe doit contenir au moins 8 caractères';
        }
        if (!/(?=.*[a-z])/.test(password)) {
            return 'Le mot de passe doit contenir au moins une lettre minuscule';
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            return 'Le mot de passe doit contenir au moins une lettre majuscule';
        }
        if (!/(?=.*\d)/.test(password)) {
            return 'Le mot de passe doit contenir au moins un chiffre';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const passwordError = validatePassword(password);
        if (passwordError) {
            setMessage({ type: 'error', text: passwordError });
            return;
        }

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
            return;
        }

        try {
            setLoading(true);
            setMessage(null);

            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    token, 
                    password 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ 
                    type: 'success', 
                    text: 'Mot de passe modifié avec succès ! Redirection vers la page de connexion...' 
                });
                
                // Redirection vers la page de connexion après 3 secondes
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            } else {
                setMessage({ type: 'error', text: data.error || 'Une erreur est survenue' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur de connexion. Veuillez réessayer.' });
        } finally {
            setLoading(false);
        }
    };

    // Token invalide ou manquant
    if (tokenValid === false) {
        return (
            <div className="flex items-center justify-center bg-white h-screen">
                <div className="p-8 w-full h-screen items-center justify-center flex flex-col">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Lien invalide</h2>
                        <p className="text-sm mb-6">
                            Ce lien de réinitialisation est invalide ou a expiré. Veuillez faire une nouvelle demande.
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-400 transition-colors"
                        >
                            Retour à la connexion
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Vérification du token en cours
    if (tokenValid === null) {
        return (
            <div className="flex items-center justify-center bg-white h-screen">
                <div className="p-8 w-full h-screen items-center justify-center flex flex-col">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p>Vérification du lien...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center bg-white h-screen">
            <div className="p-8 w-full h-screen items-center justify-center flex flex-col">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">Nouveau mot de passe</h1>
                    <p className="text-sm">
                        Choisissez un mot de passe sécurisé pour votre compte.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                            Nouveau mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600"
                                placeholder="Nouveau mot de passe"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Au moins 8 caractères avec majuscules, minuscules et chiffres
                        </p>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                            Confirmer le mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600"
                                placeholder="Confirmer le mot de passe"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-3 rounded flex items-start gap-3 ${
                            message.type === 'success' 
                                ? 'bg-green-100 border border-green-400 text-green-700' 
                                : 'bg-red-100 border border-red-400 text-red-700'
                        }`}>
                            {message.type === 'success' ? (
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            )}
                            <p className="text-sm">
                                {message.text}
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Modification en cours...' : 'Modifier le mot de passe'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center bg-white h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        }>
            <ResetPasswordComponent />
        </Suspense>
    );
}