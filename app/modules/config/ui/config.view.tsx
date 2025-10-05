'use client';

import React from 'react';
import {useConfig} from "../store/config.store";

interface AppConfig {
    id?: number;
    event_start_date: string;
    allow_visitor_registration: boolean;
    allow_visitor_accounts: boolean;
    who_can_vote: string[];
    votes_per_participant: number;
}

export const ConfigView = () => {
    const {loading, error, success, config} = useConfig();

    const saveConfig = async (updatedConfig: AppConfig) => {
        try {
            useConfig.setState({loading: true, error: undefined, success: undefined});

            const response = await fetch('/api/config', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updatedConfig)
            });

            if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

            const updated = await response.json();

            useConfig.setState({config: updated, success: 'Sauvegardé'});

            setTimeout(() => useConfig.setState({success: undefined}), 2000);
        } catch (err) {
            useConfig.setState({error: 'Erreur lors de la sauvegarde'});
        } finally {
            useConfig.setState({loading: false});
        }
    };

    const updateConfig = (updates: Partial<AppConfig>) => {
        if (!config) return;
        const updatedConfig = {...config, ...updates};
        useConfig.setState({config: updatedConfig});
        saveConfig(updatedConfig);
    };

    const toggleVotePermission = (role: string) => {
        if (!config) return;

        const currentRoles = config.who_can_vote || [];
        const newRoles = currentRoles.includes(role)
            ? currentRoles.filter(r => r !== role)
            : [...currentRoles, role];

        updateConfig({who_can_vote: newRoles});
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
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {success && (
                <div className={'p-4 fixed z-50 w-full bottom-0 left-0'}>
                    <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                        {success}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                {/* Date de début de l'événement */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jour de début de l'événement
                    </label>
                    <input
                        type="date"
                        value={config.event_start_date.slice(0, 10)}
                        onChange={(e) => updateConfig({
                            event_start_date: e.target.value + 'T18:00:00'
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Jour de fin
                        : {new Date(new Date(config.event_start_date).getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}
                    </p>
                </div>

                {/* Autoriser l'enregistrement des visiteurs */}
                <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={config.allow_visitor_registration}
                            onChange={(e) => updateConfig({
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
                                onChange={(e) => updateConfig({
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
                        onChange={(e) => updateConfig({
                            votes_per_participant: parseInt(e.target.value) || 1
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Nombre maximum de votes qu'un participant peut effectuer
                    </p>
                </div>
            </div>
        </div>
    );
};
