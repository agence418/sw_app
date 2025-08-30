'use client';

import React, { useEffect, useState } from 'react';
import { Users, Crown, RefreshCw } from 'lucide-react';

interface Team {
    id: number;
    name: string;
    idea_description?: string;
    leader_name?: string;
    leader_email?: string;
    members: Array<{
        id: number;
        name: string;
        email: string;
        role?: string;
    }>;
    created_at: string;
}

export const ListTeamsView = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTeams = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/teams');
            if (!response.ok) throw new Error('Erreur lors du chargement');
            const data = await response.json();
            setTeams(data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des équipes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTeams();
    }, []);

    return (
        <div className="w-full px-2 md:px-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        Liste des Équipes
                    </h2>
                    <button
                        onClick={loadTeams}
                        className="flex items-center justify-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Rafraîchir
                    </button>
                </div>

                <div className="p-4">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600 text-sm">Chargement des équipes...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600 text-sm">
                            {error}
                        </div>
                    ) : teams.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            Aucune équipe trouvée
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {teams.map((team) => (
                                <div key={team.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                                                <Users className="w-5 h-5 text-blue-500" />
                                                {team.name}
                                            </h3>
                                            {team.idea_description && (
                                                <p className="text-gray-600 text-sm mt-1">{team.idea_description}</p>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(team.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {team.leader_name && (
                                        <div className="mb-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Crown className="w-4 h-4 text-yellow-500" />
                                                <span className="font-medium text-gray-700">Leader:</span>
                                                <span className="text-gray-600">{team.leader_name}</span>
                                                <span className="text-gray-500">({team.leader_email})</span>
                                            </div>
                                        </div>
                                    )}

                                    {team.members && team.members.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-gray-700 text-sm mb-2">
                                                Membres ({team.members.length})
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {team.members.map((member) => (
                                                    <div key={member.id} className="bg-white rounded p-2 text-sm">
                                                        <div className="font-medium text-gray-800">{member.name}</div>
                                                        <div className="text-gray-600 text-xs">{member.email}</div>
                                                        {member.role && (
                                                            <div className="text-blue-600 text-xs font-medium mt-1">
                                                                {member.role}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};