'use client';

import React, { useState } from 'react';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';

interface ForgotPasswordViewProps {
    onBack: () => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim()) {
            setMessage({ type: 'error', text: 'Veuillez saisir votre adresse email' });
            return;
        }

        if (!email.includes('@')) {
            setMessage({ type: 'error', text: 'Veuillez saisir une adresse email valide' });
            return;
        }

        try {
            setLoading(true);
            setMessage(null);

            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                setEmailSent(true);
                setMessage({ 
                    type: 'success', 
                    text: 'Un email de réinitialisation a été envoyé à votre adresse email si elle existe dans notre système.' 
                });
            } else {
                setMessage({ type: 'error', text: data.error || 'Une erreur est survenue' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur de connexion. Veuillez réessayer.' });
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white p-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Email envoyé !</h2>
                        <p className="text-sm mb-6">
                            Si votre adresse email existe dans notre système, vous recevrez un lien de réinitialisation dans quelques minutes.
                        </p>
                        <p className="text-xs text-gray-500 mb-6">
                            Vérifiez également votre dossier de courrier indésirable (spam).
                        </p>
                        <button
                            onClick={onBack}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-400 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Retour à la connexion
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-white flex items-center justify-center">
            <div className="p-8 w-full h-screen items-center justify-center flex flex-col">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Générer un nouveau mot de passe</h1>
                    <p className="text-gray-600 text-sm">
                        Saisissez votre adresse email et nous vous enverrons un lien pour créer/réinitialiser votre mot de passe.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Adresse email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                            placeholder="votre@email.com"
                            required
                        />
                    </div>

                    {message && (
                        <div className={`p-4 rounded-lg flex items-start gap-3 ${
                            message.type === 'success' 
                                ? 'bg-green-50 border border-green-200' 
                                : 'bg-red-50 border border-red-200'
                        }`}>
                            {message.type === 'success' ? (
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            )}
                            <p className={`text-sm ${
                                message.type === 'success' ? 'text-green-800' : 'text-red-800'
                            }`}>
                                {message.text}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                        </button>

                        <button
                            type="button"
                            onClick={onBack}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Retour à la connexion
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};