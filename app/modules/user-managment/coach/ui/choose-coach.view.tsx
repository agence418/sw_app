import {MessageSquare, Users, AlertCircle} from "lucide-react";
import React, {useState, useEffect} from "react";
import { useSession } from "next-auth/react";

interface Coach {
    id: number;
    name: string;
    email: string;
    expertise: string;
}

interface Team {
    id: number;
    name: string;
    leader_id: number;
}

export const ChooseCoachView = () => {
    const { data: session } = useSession();
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [coachPreferences, setCoachPreferences] = useState<string[]>([]);
    const [userTeam, setUserTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    const fetchData = async () => {
        if (!session?.user?.id) return;

        try {
            setLoading(true);
            
            // Charger les coachs et l'équipe de l'utilisateur en parallèle
            const [coachesResponse, teamResponse] = await Promise.all([
                fetch('/api/coaches'),
                fetch(`/api/teams?leaderId=${session.user.id}`)
            ]);

            if (coachesResponse.ok) {
                const coachesData = await coachesResponse.json();
                setCoaches(coachesData);
            }

            if (teamResponse.ok) {
                const teamsData = await teamResponse.json();
                const team = teamsData.find((t: Team) => t.leader_id === parseInt(session.user.id));
                
                if (team) {
                    setUserTeam(team);
                    
                    // Charger les préférences existantes pour cette équipe
                    const preferencesResponse = await fetch(`/api/coach-preferences?teamId=${team.id}`);
                    if (preferencesResponse.ok) {
                        const preferences = await preferencesResponse.json();
                        setCoachPreferences(preferences.map((p: any) => p.coach_name));
                    }
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            setMessage({type: 'error', text: 'Erreur lors du chargement des données'});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [session]);

    const handleCoachToggle = async (coachName: string, isChecked: boolean) => {
        if (!userTeam) return;

        try {
            if (isChecked) {
                // Vérifier la limite de 3 coachs
                if (coachPreferences.length >= 3) {
                    setMessage({type: 'error', text: 'Vous ne pouvez sélectionner que 3 coachs maximum'});
                    return;
                }

                // Ajouter la préférence
                const response = await fetch('/api/coach-preferences', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        teamId: userTeam.id,
                        coachName: coachName
                    })
                });

                if (response.ok) {
                    setCoachPreferences(prev => [...prev, coachName]);
                    setMessage({type: 'success', text: 'Coach ajouté à vos préférences'});
                } else {
                    const error = await response.json();
                    setMessage({type: 'error', text: error.error || 'Erreur lors de l\'ajout'});
                }
            } else {
                // Supprimer la préférence
                const response = await fetch('/api/coach-preferences', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        teamId: userTeam.id,
                        coachName: coachName
                    })
                });

                if (response.ok) {
                    setCoachPreferences(prev => prev.filter(c => c !== coachName));
                    setMessage({type: 'success', text: 'Coach retiré de vos préférences'});
                } else {
                    setMessage({type: 'error', text: 'Erreur lors de la suppression'});
                }
            }
        } catch (error) {
            console.error('Erreur:', error);
            setMessage({type: 'error', text: 'Erreur lors de la modification'});
        }

        // Effacer le message après 3 secondes
        setTimeout(() => setMessage(null), 3000);
    };

    if (!session?.user?.id) {
        return (
            <div className="bg-yellow-50 rounded-xl p-6 shadow-sm border border-yellow-200">
                <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2"/>
                    <span className="text-yellow-800">Vous devez être connecté pour accéder à cette page</span>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <div className="mt-2 text-gray-500">Chargement...</div>
                </div>
            </div>
        );
    }

    if (!userTeam) {
        return (
            <div className="bg-yellow-50 rounded-xl p-6 shadow-sm border border-yellow-200">
                <div className="flex items-center">
                    <Users className="w-5 h-5 text-yellow-600 mr-2"/>
                    <div>
                        <div className="text-yellow-800 font-medium">Sélection des coach</div>
                        <div className="text-yellow-700 text-sm mt-1">
                            Vous devez être leader d'une équipe pour sélectionner des coachs
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-500"/>
                Préférences de coaching
            </h2>
            <div className="mb-4 text-sm">
                <div className="text-gray-600 flex items-center">
                    <Users className="w-4 h-4 mr-1"/>
                    Équipe: <span className="font-medium ml-1">{userTeam.name}</span>
                </div>
            </div>
            <p className="text-gray-600 mb-6 text-sm">
                Sélectionnez jusqu'à 3 coaches que votre équipe aimerait rencontrer samedi.
                <br/>
                <span className="text-blue-500 font-medium">
                    {coachPreferences.length}/3 coaches sélectionnés
                </span>
            </p>

            {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                    message.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-3">
                {coaches.map((coach) => {
                    const isSelected = coachPreferences.includes(coach.name);
                    const isDisabled = !isSelected && coachPreferences.length >= 3;

                    return (
                        <label key={coach.id}
                               className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                                   isDisabled 
                                       ? 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 cursor-not-allowed opacity-60' 
                                       : isSelected
                                           ? 'border-blue-300 bg-gray-50 dark:bg-gray-900 hover:bg-blue-100'
                                           : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50'
                               }`}>
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-500 mr-3"
                                checked={isSelected}
                                disabled={isDisabled}
                                onChange={(e) => handleCoachToggle(coach.name, e.target.checked)}
                            />
                            <div className="flex-1">
                                <div className="text-gray-800 font-medium">{coach.name}</div>
                                {coach.expertise && (
                                    <div className="text-sm text-gray-600">{coach.expertise}</div>
                                )}
                            </div>
                            {isSelected && (
                                <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Sélectionné
                                </div>
                            )}
                        </label>
                    );
                })}
            </div>
        </div>
    )
}