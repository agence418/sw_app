'use client';

import {useState} from 'react';
import {validateEmail, validatePassword} from '@/lib/validation';

interface RegisterViewProps {
    onBackToLogin: () => void;
}

export const RegisterView = ({onBackToLogin}: RegisterViewProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptCGU, setAcceptCGU] = useState(false);
    const [showCGU, setShowCGU] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!acceptCGU) {
            setError('Vous devez accepter les conditions générales d\'utilisation');
            setIsLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError('Veuillez entrer une adresse email valide');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setIsLoading(false);
            return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.error);
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
            <div className="flex items-center justify-center bg-white dark:bg-black h-screen">
                <div className="p-8 w-full h-screen items-center justify-center flex flex-col">
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        Enregistrement réussi ! Redirection vers la page de connexion...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center bg-white dark:bg-black h-screen">
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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600 dark:text-gray-900"
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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600 dark:text-gray-900"
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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600 dark:text-gray-900"
                            placeholder="Mot de passe sécurisé"
                            required
                            disabled={isLoading}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Min. 8 caractères avec majuscule, minuscule, chiffre et caractère spécial
                        </p>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirmer le mot de
                            passe</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600 dark:text-gray-900"
                            placeholder="Confirmer le mot de passe"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* CGU */}
                    <div>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={acceptCGU}
                                onChange={(e) => setAcceptCGU(e.target.checked)}
                                className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                disabled={isLoading}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                J'accepte les{' '}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowCGU(true);
                                    }}
                                    className="text-green-600 hover:text-green-400 underline"
                                    disabled={isLoading}
                                >
                                    conditions générales d'utilisation
                                </button>
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !acceptCGU}
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

            {/* Modale CGU */}
            {showCGU && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-black rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Conditions Générales d'Utilisation</h3>
                            <button
                                onClick={() => setShowCGU(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
                            <h4 className="font-semibold text-gray-900">1. Objet</h4>
                            <p>
                                Les présentes conditions générales d'utilisation (CGU) régissent l'accès et l'utilisation
                                de la plateforme Startup Weekend en tant que visiteur.
                            </p>

                            <h4 className="font-semibold text-gray-900">2. Inscription</h4>
                            <p>
                                L'inscription en tant que visiteur est gratuite et vous permet d'accéder aux contenus
                                publics de l'événement Startup Weekend. Vous vous engagez à fournir des informations
                                exactes lors de votre inscription.
                            </p>

                            <h4 className="font-semibold text-gray-900">3. Protection des données</h4>
                            <p>
                                Vos données personnelles (nom, email) sont collectées uniquement dans le cadre de
                                votre participation en tant que visiteur. Ces données ne seront pas partagées avec
                                des tiers sans votre consentement.
                            </p>

                            <h4 className="font-semibold text-gray-900">4. Utilisation du compte</h4>
                            <p>
                                Vous êtes responsable de la confidentialité de votre mot de passe et de toutes les
                                activités effectuées depuis votre compte. Vous vous engagez à ne pas utiliser la
                                plateforme à des fins illégales ou non autorisées.
                            </p>

                            <h4 className="font-semibold text-gray-900">5. Droits d'accès</h4>
                            <p>
                                En tant que visiteur, votre accès peut être limité à certaines fonctionnalités de
                                la plateforme. Les organisateurs se réservent le droit de modifier ces accès à tout moment.
                            </p>

                            <h4 className="font-semibold text-gray-900">6. Responsabilité</h4>
                            <p>
                                Les organisateurs du Startup Weekend ne peuvent être tenus responsables des dommages
                                directs ou indirects résultant de l'utilisation de la plateforme.
                            </p>

                            <h4 className="font-semibold text-gray-900">7. Modification des CGU</h4>
                            <p>
                                Les présentes CGU peuvent être modifiées à tout moment. Les utilisateurs seront
                                informés de toute modification significative.
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowCGU(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Fermer
                            </button>
                            <button
                                onClick={() => {
                                    setAcceptCGU(true);
                                    setShowCGU(false);
                                }}
                                className="px-4 py-2 bg-green-600 text-white dark:text-gray-900 rounded-md hover:bg-green-700 transition-colors"
                            >
                                Accepter les CGU
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}