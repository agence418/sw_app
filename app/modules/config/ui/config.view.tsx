'use client';

import React, { useEffect, useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';

interface AppConfig {
    id?: number;
    event_start_date: string;
    allow_visitor_registration: boolean;
    allow_visitor_accounts: boolean;
    who_can_vote: string[];
    votes_per_participant: number;
}

export const ConfigView = () => {
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const loadConfig = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/config');
            if (!response.ok) throw new Error('Erreur lors du chargement de la configuration');
            const data = await response.json();
            setConfig(data || {
                event_start_date: '2025-09-05T18:00:00',
                allow_visitor_registration: true,
                allow_visitor_accounts: true,
                who_can_vote: ['participant'],
                votes_per_participant: 3
            });
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement de la configuration');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadConfig();
    }, []);

    const handleSave = async () => {
        if (!config) return;

        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            const response = await fetch('/api/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

            const updated = await response.json();
            setConfig(updated);
            setSuccess('Configuration sauvegardée avec succès !');

            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Erreur lors de la sauvegarde de la configuration');
        } finally {
            setSaving(false);
        }
    };

    const toggleVotePermission = (role: string) => {
        if (!config) return;

        const currentRoles = config.who_can_vote || [];
        const newRoles = currentRoles.includes(role)
            ? currentRoles.filter(r => r !== role)
            : [...currentRoles, role];

        setConfig({ ...config, who_can_vote: newRoles });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!config) return null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Configuration</h2>
                <button
                    onClick={loadConfig}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Actualiser
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    {success}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                {/* Date de début de l'événement */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de début de l'événement
                    </label>
                    <input
                        type="datetime-local"
                        value={config.event_start_date.slice(0, 16)}
                        onChange={(e) => setConfig({
                            ...config,
                            event_start_date: e.target.value + ':00'
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600"
                    />
                </div>

                {/* Autoriser l'enregistrement des visiteurs */}
                <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={config.allow_visitor_registration}
                            onChange={(e) => setConfig({
                                ...config,
                                allow_visitor_registration: e.target.checked
                            })}
                            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            Autoriser l'enregistrement des visiteurs
                        </span>
                    </label>
                    <p className="ml-8 text-xs text-gray-500 mt-1">
                        Permet aux nouveaux visiteurs de créer un compte via la page d'inscription
                    </p>
                </div>

                {/* Qui peut se connecter */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Qui peut se connecter</h3>
                    <div className="space-y-2 ml-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={config.allow_visitor_accounts}
                                onChange={(e) => setConfig({
                                    ...config,
                                    allow_visitor_accounts: e.target.checked
                                })}
                                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">
                                Autoriser les visiteurs à se connecter
                            </span>
                        </label>
                        <p className="ml-8 text-xs text-gray-500">
                            Les visiteurs peuvent se connecter avec leurs identifiants
                        </p>
                    </div>
                </div>

                {/* Qui peut voter */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Qui peut voter</h3>
                    <div className="space-y-2 ml-4">
                        {['participant', 'coach', 'visitor', 'admin'].map((role) => (
                            <label key={role} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.who_can_vote.includes(role)}
                                    onChange={() => toggleVotePermission(role)}
                                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-700 capitalize">
                                    {role === 'participant' ? 'Participants' :
                                     role === 'coach' ? 'Coachs' :
                                     role === 'visitor' ? 'Visiteurs' :
                                     'Administrateurs'}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Nombre de votes par participant */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de votes par participant
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={config.votes_per_participant}
                        onChange={(e) => setConfig({
                            ...config,
                            votes_per_participant: parseInt(e.target.value) || 1
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Nombre maximum de votes qu'un participant peut effectuer
                    </p>
                </div>
            </div>

            {/* Bouton de sauvegarde */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Enregistrement...' : 'Enregistrer la configuration'}
                </button>
            </div>
        </div>
    );
};
