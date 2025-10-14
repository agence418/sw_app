'use client';

import { useState } from 'react';
import { AlertCircle, Database, RefreshCw } from 'lucide-react';

export default function ResetDatabasePage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleReset = async () => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/reset-database', {
                method: 'POST',
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    type: 'success',
                    text: 'Base de données réinitialisée avec succès !'
                });
            } else {
                setMessage({
                    type: 'error',
                    text: data.error || 'Erreur lors de la réinitialisation'
                });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Erreur de connexion au serveur'
            });
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-black rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center mb-6">
                        <Database className="w-8 h-8 mr-3 text-red-500" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Réinitialiser la base de données
                        </h1>
                    </div>

                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 mr-2 text-red-600 dark:text-red-400 mt-0.5" />
                            <div className="text-sm text-red-800 dark:text-red-200">
                                <strong>Attention !</strong> Cette action va :
                                <ul className="list-disc ml-5 mt-2 space-y-1">
                                    <li>Supprimer toutes les données existantes</li>
                                    <li>Recréer toutes les tables</li>
                                    <li>Réinitialiser la configuration par défaut</li>
                                </ul>
                                <p className="mt-2 font-semibold">Cette action est irréversible !</p>
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-lg ${
                            message.type === 'success'
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    {!showConfirm ? (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
                        >
                            <RefreshCw className="w-5 h-5 mr-2" />
                            Réinitialiser la base de données
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-center text-gray-700 dark:text-gray-300 font-semibold">
                                Êtes-vous absolument sûr ?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    disabled={loading}
                                    className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleReset}
                                    disabled={loading}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                            Réinitialisation...
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="w-5 h-5 mr-2" />
                                            Oui, réinitialiser
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-semibold mb-2">Cette opération exécutera :</p>
                        <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs">
                            /reset.sql
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
}
