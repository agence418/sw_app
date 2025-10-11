'use client';

import React, { useEffect, useState } from 'react';
import { Users, Crown, RefreshCw, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { useSession } from "next-auth/react";

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
    coach_requests?: string[];
    created_at: string;
}

export const ListTeamsView = () => {
    const { data: session } = useSession();
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isCoach = session?.user?.role === 'coach';
    const coachName = session?.user?.name;

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

    const renderCoachView = () => {
        const teamsForThisCoach = teams.filter(team => 
            team.coach_requests && team.coach_requests.includes(coachName || '')
        );
        const otherTeams = teams.filter(team => 
            !team.coach_requests || !team.coach_requests.includes(coachName || '')
        );

        return (
            <>
                {teamsForThisCoach.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-medium text-gray-700 text-sm mb-4 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Équipes qui souhaitent vous rencontrer ({teamsForThisCoach.length})
                        </h3>
                        <div className="space-y-4">
                            {teamsForThisCoach.map((team) => (
                                <div key={team.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                                    <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2 mb-2">
                                        <Users className="w-5 h-5 text-green-600" />
                                        {team.name}
                                    </h3>
                                    {team.idea_description && (
                                        <p className="text-gray-600 text-sm mb-3">{team.idea_description}</p>
                                    )}
                                    {team.leader_name && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Crown className="w-4 h-4 text-yellow-500" />
                                            <span className="font-medium text-gray-700">Leader:</span>
                                            <span className="text-gray-600">{team.leader_name}</span>
                                            <span className="text-gray-500">({team.leader_email})</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {otherTeams.length > 0 && (
                    <div>
                        <h3 className="font-medium text-gray-700 text-sm mb-4 flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-gray-600" />
                            Autres équipes ({otherTeams.length})
                        </h3>
                        <div className="space-y-4">
                            {otherTeams.map((team) => (
                                <div key={team.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                                    <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2 mb-2">
                                        <Users className="w-5 h-5 text-gray-500" />
                                        {team.name}
                                    </h3>
                                    {team.idea_description && (
                                        <p className="text-gray-600 text-sm mb-3">{team.idea_description}</p>
                                    )}
                                    {team.leader_name && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Crown className="w-4 h-4 text-yellow-500" />
                                            <span className="font-medium text-gray-700">Leader:</span>
                                            <span className="text-gray-600">{team.leader_name}</span>
                                            <span className="text-gray-500">({team.leader_email})</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </>
        );
    };

    const renderAdminView = () => {
        const teamsWithCoaches = teams.filter(team => 
            team.coach_requests && team.coach_requests.length > 0
        );
        const teamsWithoutCoaches = teams.filter(team => 
            !team.coach_requests || team.coach_requests.length === 0
        );

        return (
            <>
                {teamsWithCoaches.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-medium text-gray-700 text-sm mb-4 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-green-600" />
                            Équipes avec demandes de coaching ({teamsWithCoaches.length})
                        </h3>
                        <div className="space-y-4">
                            {teamsWithCoaches.map((team) => (
                                <div key={team.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
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

                                    {team.coach_requests && team.coach_requests.length > 0 && (
                                        <div className="mb-3">
                                            <div className="flex items-center gap-2 text-sm mb-2">
                                                <MessageSquare className="w-4 h-4 text-green-600" />
                                                <span className="font-medium text-gray-700">
                                                    Coaches demandés ({team.coach_requests.length}/3):
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {team.coach_requests.map((coach, index) => (
                                                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                                                        {coach}
                                                    </span>
                                                ))}
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
                                                    <div key={member.id} className="bg-white dark:bg-black rounded p-2 text-sm">
                                                        <div className="font-medium text-gray-800">{member.name}</div>
                                                        <div className="text-gray-600 text-xs">{member.email}</div>
                                                        {member.role && (
                                                            <div className="text-blue-500 text-xs font-medium mt-1">
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
                    </div>
                )}

                {teamsWithoutCoaches.length > 0 && (
                    <div>
                        <h3 className="font-medium text-gray-700 text-sm mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4 text-orange-600" />
                            Équipes sans demandes de coaching ({teamsWithoutCoaches.length})
                        </h3>
                        <div className="space-y-4">
                            {teamsWithoutCoaches.map((team) => (
                                <div key={team.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
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

                                    <div className="mb-3 text-sm">
                                        <div className="flex items-center gap-2 text-orange-600">
                                            <MessageSquare className="w-4 h-4" />
                                            <span className="italic">Aucune demande de coaching pour le moment</span>
                                        </div>
                                    </div>

                                    {team.members && team.members.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-gray-700 text-sm mb-2">
                                                Membres ({team.members.length})
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {team.members.map((member) => (
                                                    <div key={member.id} className="bg-white dark:bg-black rounded p-2 text-sm">
                                                        <div className="font-medium text-gray-800">{member.name}</div>
                                                        <div className="text-gray-600 text-xs">{member.email}</div>
                                                        {member.role && (
                                                            <div className="text-blue-500 text-xs font-medium mt-1">
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
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="w-full px-2 md:px-4">
            <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        Liste des Équipes
                    </h2>
                    <button
                        onClick={loadTeams}
                        className="flex items-center justify-center gap-2 bg-gray-600 text-white dark:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Rafraîchir
                    </button>
                </div>

                <div className="p-4">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
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
                    ) : isCoach ? (
                        renderCoachView()
                    ) : (
                        renderAdminView()
                    )}
                </div>
            </div>
        </div>
    );
};