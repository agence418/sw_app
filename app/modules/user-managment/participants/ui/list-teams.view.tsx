'use client';

import React, {useEffect, useState} from 'react';
import {
    CheckCircle,
    Crown,
    Edit2,
    GraduationCap,
    MapPin,
    MessageSquare,
    Plus,
    RefreshCw,
    Save,
    Trash2,
    Users,
    X,
    XCircle
} from 'lucide-react';
import {useSession} from "next-auth/react";

interface Team {
    id: number;
    name: string;
    idea_description?: string;
    position?: string;
    leader_name?: string;
    leader_email?: string;
    members: Array<{
        id: number;
        name: string;
        email: string;
        role?: string;
    }>;
    coach_requests?: string[];
    assigned_coaches?: string[];
    created_at: string;
}

interface Coach {
    id: number;
    name: string;
    email: string;
}

interface Participant {
    id: number;
    name: string;
    email: string;
}

export const ListTeamsView = () => {
    const {data: session} = useSession();
    const [teams, setTeams] = useState<Team[]>([]);
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // États pour les modals/édition
    const [editingPosition, setEditingPosition] = useState<number | null>(null);
    const [positionValue, setPositionValue] = useState('');
    const [addingCoach, setAddingCoach] = useState<number | null>(null);
    const [addingMember, setAddingMember] = useState<number | null>(null);

    const isCoach = session?.user?.role === 'coach';
    const isAdmin = session?.user?.role === 'admin';
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

    const loadCoaches = async () => {
        try {
            const response = await fetch('/api/coaches');
            if (!response.ok) throw new Error('Erreur');
            const data = await response.json();
            setCoaches(data);
        } catch (err) {
            console.error('Erreur chargement coaches:', err);
        }
    };

    const loadParticipants = async () => {
        try {
            const response = await fetch('/api/participants');
            if (!response.ok) throw new Error('Erreur');
            const data = await response.json();
            setParticipants(data);
        } catch (err) {
            console.error('Erreur chargement participants:', err);
        }
    };

    const handleEditPosition = (teamId: number, currentPosition?: string) => {
        setEditingPosition(teamId);
        setPositionValue(currentPosition || '');
    };

    const handleSavePosition = async (teamId: number) => {
        try {
            const response = await fetch(`/api/teams/${teamId}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({position: positionValue})
            });
            if (!response.ok) throw new Error('Erreur');
            await loadTeams();
            setEditingPosition(null);
            setPositionValue('');
        } catch (err) {
            alert('Erreur lors de la mise à jour de la position');
        }
    };

    const handleAddCoach = async (teamId: number, coachId: number) => {
        try {
            const response = await fetch(`/api/teams/${teamId}/coaches`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({coachId})
            });
            if (!response.ok) throw new Error('Erreur');
            await loadTeams();
            setAddingCoach(null);
        } catch (err) {
            alert('Erreur lors de l\'affectation du coach');
        }
    };

    const handleRemoveCoach = async (teamId: number, coachName: string) => {
        const coach = coaches.find(c => c.name === coachName);
        if (!coach) return;
        if (!confirm(`Retirer ${coachName} de cette équipe ?`)) return;
        try {
            const response = await fetch(`/api/teams/${teamId}/coaches?coachId=${coach.id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Erreur');
            await loadTeams();
        } catch (err) {
            alert('Erreur lors du retrait du coach');
        }
    };

    const handleAddMember = async (teamId: number, participantId: number) => {
        try {
            const response = await fetch(`/api/teams/${teamId}/members`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({participantId})
            });
            if (!response.ok) throw new Error('Erreur');
            await loadTeams();
            setAddingMember(null);
        } catch (err) {
            alert('Erreur lors de l\'ajout du membre');
        }
    };

    const handleRemoveMember = async (teamId: number, memberId: number, memberName: string) => {
        if (!confirm(`Retirer ${memberName} de cette équipe ?`)) return;
        try {
            const response = await fetch(`/api/teams/${teamId}/members?participantId=${memberId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Erreur');
            await loadTeams();
        } catch (err) {
            alert('Erreur lors du retrait du membre');
        }
    };

    useEffect(() => {
        loadTeams();
        if (isAdmin) {
            loadCoaches();
            loadParticipants();
        }
    }, [isAdmin]);

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
                        <h3 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-4 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600"/>
                            Équipes qui souhaitent vous rencontrer ({teamsForThisCoach.length})
                        </h3>
                        <div className="space-y-4">
                            {teamsForThisCoach.map((team) => (
                                <div key={team.id}
                                     className="border border-green-200 rounded-lg p-4 bg-green-50 dark:bg-green-800 dark:border-green-700">
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg flex items-center gap-2 mb-2">
                                        <Users className="w-5 h-5 text-green-600"/>
                                        {team.name}
                                    </h3>
                                    {team.idea_description && (
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{team.idea_description}</p>
                                    )}
                                    {team.position && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-red-600"/>
                                            <div className="text-gray-700 dark:text-gray-300 py-2">{team.position}
                                            </div>
                                        </div>
                                    )}
                                    {team.leader_name && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Crown className="w-4 h-4 text-yellow-500"/>
                                            <div className="">
                                                <div className="text-gray-600 dark:text-gray-400">
                                                    <span
                                                        className="font-medium text-gray-700 dark:text-gray-300">Leader:</span> {team.leader_name}
                                                </div>
                                                <div
                                                    className="text-gray-600 dark:text-gray-400">({team.leader_email})
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {otherTeams.length > 0 && (
                    <div>
                        <h3 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-4 flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-gray-600 dark:text-gray-400"/>
                            Autres équipes ({otherTeams.length})
                        </h3>
                        <div className="space-y-4">
                            {otherTeams.map((team) => (
                                <div key={team.id}
                                     className="border border-green-200 rounded-lg p-4 bg-green-50 dark:bg-gray-800 dark:border-gray-700">
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg flex items-center gap-2 mb-2">
                                        <Users className="w-5 h-5 text-green-600"/>
                                        {team.name}
                                    </h3>
                                    {team.idea_description && (
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{team.idea_description}</p>
                                    )}
                                    {team.position && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-red-600"/>
                                            <div className="text-gray-700 dark:text-gray-300 py-2">{team.position}
                                            </div>
                                        </div>
                                    )}
                                    {team.leader_name && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Crown className="w-4 h-4 text-yellow-500"/>
                                            <div className="">
                                                <div className="text-gray-600 dark:text-gray-400">
                                                    <span
                                                        className="font-medium text-gray-700 dark:text-gray-300">Leader:</span> {team.leader_name}
                                                </div>
                                                <div
                                                    className="text-gray-600 dark:text-gray-400">({team.leader_email})
                                                </div>
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
                        <h3 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-4 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-green-600"/>
                            Équipes avec demandes de coaching ({teamsWithCoaches.length})
                        </h3>
                        <div className="space-y-4">
                            {teamsWithCoaches.map((team) => (
                                <div key={team.id}
                                     className="border border-green-200 rounded-lg p-4 bg-green-50 dark:bg-gray-800 dark:border-green-700">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg flex items-center gap-2">
                                                <Users className="w-5 h-5 text-blue-500"/>
                                                {team.name}
                                            </h3>
                                            {team.idea_description && (
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{team.idea_description}</p>
                                            )}

                                        </div>
                                    </div>

                                    {/* Position - Éditable pour admin */}
                                    {editingPosition === team.id ? (
                                        <div className="flex items-center gap-2 mb-2 w-full">
                                            <MapPin className="w-4 h-4 text-red-600"/>
                                            <input
                                                type="text"
                                                value={positionValue}
                                                onChange={(e) => setPositionValue(e.target.value)}
                                                className="flex-1 px-2 py-1 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 w-full"
                                            />
                                            <button onClick={() => handleSavePosition(team.id)}
                                                    className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded">
                                                <Save className="w-4 h-4"/>
                                            </button>
                                            <button onClick={() => setEditingPosition(null)}
                                                    className="p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                                <X className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin className="w-4 h-4 text-red-600"/>
                                            <div
                                                className="text-gray-700 dark:text-gray-300 py-2">{team.position || 'Non définie'}</div>
                                            <button onClick={() => handleEditPosition(team.id, team.position)}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded">
                                                <Edit2 className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    )}

                                    {team.leader_name && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Crown className="w-4 h-4 text-yellow-500"/>
                                            <div className="">
                                                <div className="text-gray-600 dark:text-gray-400">
                                                    <span
                                                        className="font-medium text-gray-700 dark:text-gray-300">Leader:</span> {team.leader_name}
                                                </div>
                                                <div
                                                    className="text-gray-600 dark:text-gray-400">({team.leader_email})
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Coaches affectés - NOUVEAU */}
                                    <div className="mb-3 mt-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <GraduationCap className="w-4 h-4 text-purple-600"/>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    Coaches affectés:
                                                </span>
                                            </div>
                                            <button onClick={() => setAddingCoach(team.id)} className="px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-xs flex items-center gap-1">
                                                <Plus className="w-3 h-3"/> Affecter
                                            </button>
                                        </div>

                                        {addingCoach === team.id && (
                                            <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-900 rounded border dark:border-gray-700 flex gap-2">
                                                <select
                                                    onChange={(e) => { if (e.target.value) handleAddCoach(team.id, parseInt(e.target.value)); }}
                                                    className="flex-1 px-2 py-1 border rounded text-xs dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                                >
                                                    <option value="">Sélectionner un coach...</option>
                                                    {coaches.filter(c => !team.assigned_coaches?.includes(c.name)).map(coach => (
                                                        <option key={coach.id} value={coach.id}>{coach.name}</option>
                                                    ))}
                                                </select>
                                                <button onClick={() => setAddingCoach(null)} className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600">
                                                    <X className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        )}

                                        {team.assigned_coaches && team.assigned_coaches.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {team.assigned_coaches.map((coachName, index) => (
                                                    <div key={index} className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs font-medium">
                                                        <span>{coachName}</span>
                                                        <button onClick={() => handleRemoveCoach(team.id, coachName)} className="ml-1 hover:text-red-600">
                                                            <Trash2 className="w-3 h-3"/>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400 text-xs italic">Aucun coach affecté</p>
                                        )}
                                    </div>

                                    {team.coach_requests && team.coach_requests.length > 0 && (
                                        <div className="mb-3 mt-2">
                                            <div className="flex items-center gap-2 text-sm mb-2">
                                                <MessageSquare className="w-4 h-4 text-green-600"/>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    Coaches demandés ({team.coach_requests.length}/3):
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {team.coach_requests.map((coach, index) => (
                                                    <span key={index}
                                                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                                                        {coach}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Membres - Avec gestion */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                                                Membres ({team.members?.length || 0})
                                            </h4>
                                            <button onClick={() => setAddingMember(team.id)} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs flex items-center gap-1">
                                                <Plus className="w-3 h-3"/> Ajouter
                                            </button>
                                        </div>

                                        {addingMember === team.id && (
                                            <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-900 rounded border dark:border-gray-700 flex gap-2">
                                                <select
                                                    onChange={(e) => { if (e.target.value) handleAddMember(team.id, parseInt(e.target.value)); }}
                                                    className="flex-1 px-2 py-1 border rounded text-xs dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                                >
                                                    <option value="">Sélectionner un participant...</option>
                                                    {participants.filter(p => !team.members?.some(m => m.id === p.id)).map(participant => (
                                                        <option key={participant.id} value={participant.id}>{participant.name} ({participant.email})</option>
                                                    ))}
                                                </select>
                                                <button onClick={() => setAddingMember(null)} className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600">
                                                    <X className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        )}

                                        {team.members && team.members.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {team.members.map((member) => (
                                                    <div key={member.id} className="bg-white dark:bg-black rounded p-2 text-sm flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium text-gray-800 dark:text-gray-200">{member.name}</div>
                                                            <div className="text-gray-600 dark:text-gray-400 text-xs">{member.email}</div>
                                                            {member.role && (
                                                                <div className="text-blue-500 text-xs font-medium mt-1">{member.role}</div>
                                                            )}
                                                        </div>
                                                        <button onClick={() => handleRemoveMember(team.id, member.id, member.name)} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded">
                                                            <Trash2 className="w-4 h-4"/>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400 text-xs italic">Aucun membre</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {teamsWithoutCoaches.length > 0 && (
                    <div>
                        <h3 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4 text-orange-600"/>
                            Équipes sans demandes de coaching ({teamsWithoutCoaches.length})
                        </h3>
                        <div className="space-y-4">
                            {teamsWithoutCoaches.map((team) => (
                                <div key={team.id}
                                     className="border border-orange-200 dark:border-orange-800 rounded-lg p-4 bg-orange-50 dark:bg-gray-800">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg flex items-center gap-2">
                                                <Users className="w-5 h-5 text-blue-500"/>
                                                {team.name}
                                            </h3>
                                            {team.idea_description && (
                                                <p className="text-gray-600 text-sm mt-1">{team.idea_description}</p>
                                            )}
                                        </div>
                                    </div>

                                    {team.position && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-red-600"/>
                                            <div className="text-gray-700 dark:text-gray-300 py-2">{team.position}
                                            </div>
                                        </div>
                                    )}

                                    {team.leader_name && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Crown className="w-4 h-4 text-yellow-500"/>
                                            <div className="">
                                                <div className="text-gray-600 dark:text-gray-400">
                                                    <span
                                                        className="font-medium text-gray-700 dark:text-gray-300">Leader:</span> {team.leader_name}
                                                </div>
                                                <div
                                                    className="text-gray-600 dark:text-gray-400">({team.leader_email})
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-3 text-sm mt-2">
                                        <div className="flex items-center gap-2 text-orange-600">
                                            <MessageSquare className="w-4 h-4"/>
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
                                                    <div key={member.id}
                                                         className="bg-white dark:bg-black rounded p-2 text-sm">
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
                    <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2 dark:text-gray-200">
                        <Users className="w-5 h-5 text-green-600 "/>
                        Liste des Équipes
                    </h2>
                    <button
                        onClick={loadTeams}
                        className="flex items-center justify-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}/>
                        Rafraîchir
                    </button>
                </div>

                <div className="p-4">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gren-600 mx-auto"></div>
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