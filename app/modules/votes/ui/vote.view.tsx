import {Users, CheckCircle2, AlertCircle} from "lucide-react";
import React, {useState, useEffect} from "react";
import {ProjectsProvider, useProjects} from "../../projects/contexts/projects.context";
import { Project } from "../../projects/types/project.types";
import { useSession } from "next-auth/react";

interface Participant {
    id: string;
    name: string;
    email: string;
}

export const VoteView = () => {
    return(
        <ProjectsProvider>
            <Vote/>
        </ProjectsProvider>
    )
}

export const Vote = () => {
    const { data: session } = useSession();
    const { projects, loading, error, fetchProjects } = useProjects();
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const [userVotesCount, setUserVotesCount] = useState<number>(0);
    const [checkingVotes, setCheckingVotes] = useState(false);

    useEffect(() => {
        fetchProjects();
        if (session?.user?.id) {
            checkUserVotes();
        }
    }, [session]);

    const checkUserVotes = async () => {
        if (!session?.user?.id) return;
        
        setCheckingVotes(true);
        try {
            const response = await fetch(`/api/votes?participantId=${session.user.id}`);
            if (response.ok) {
                const votes = await response.json();
                setUserVotesCount(votes.length);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification des votes:', error);
        } finally {
            setCheckingVotes(false);
        }
    };

    const handleProjectSelection = (projectId: string) => {
        setSelectedProjects(prev => {
            if (prev.includes(projectId)) {
                return prev.filter(id => id !== projectId);
            }
            if (prev.length >= 3) {
                setSubmitMessage({type: 'error', text: 'Vous ne pouvez sélectionner que 3 projets maximum'});
                setTimeout(() => setSubmitMessage(null), 3000);
                return prev;
            }
            return [...prev, projectId];
        });
    };

    const handleSubmit = async () => {
        if (!session?.user?.id) {
            setSubmitMessage({type: 'error', text: 'Vous devez être connecté pour voter'});
            setTimeout(() => setSubmitMessage(null), 3000);
            return;
        }

        if (selectedProjects.length !== 3) {
            setSubmitMessage({type: 'error', text: 'Veuillez sélectionner exactement 3 projets'});
            setTimeout(() => setSubmitMessage(null), 3000);
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            const votePromises = selectedProjects.map(projectId => 
                fetch('/api/votes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        participantId: session.user.id,
                        projectId: projectId,
                        value: 1
                    })
                })
            );

            const responses = await Promise.all(votePromises);
            const allSuccessful = responses.every(response => response.ok);

            if (allSuccessful) {
                setSubmitMessage({type: 'success', text: 'Vos votes ont été enregistrés avec succès!'});
                setSelectedProjects([]);
            } else {
                setSubmitMessage({type: 'error', text: 'Erreur lors de l\'enregistrement de certains votes'});
            }
        } catch (error) {
            console.error('Erreur lors de la soumission des votes:', error);
            setSubmitMessage({type: 'error', text: 'Erreur lors de l\'enregistrement des votes'});
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitMessage(null), 5000);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-center text-gray-600">Chargement des projets...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Votes des projets
            </h2>
            
            <p className="text-gray-600 mb-6 text-sm">
                Votez pour vos 3 projets préférés. Vous devez sélectionner exactement 3 projets.
            </p>

            {submitMessage && (
                <div className={`mb-4 p-3 rounded-lg text-sm flex items-center ${
                    submitMessage.type === 'success' 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-red-50 text-red-600'
                }`}>
                    {submitMessage.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                    ) : (
                        <AlertCircle className="w-4 h-4 mr-2" />
                    )}
                    {submitMessage.text}
                </div>
            )}

            {checkingVotes ? (
                <div className="text-center py-8 text-gray-500">
                    Vérification de vos votes...
                </div>
            ) : userVotesCount >= 3 ? (
                <div className="text-center py-8">
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                        <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-600" />
                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                            Vous avez voté !
                        </h3>
                        <p className="text-sm text-green-600">
                            Les résultats seront annoncés bientôt.
                        </p>
                    </div>
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    Aucun projet disponible pour le moment
                </div>
            ) : (
                <>
                    <div className="space-y-3 mb-6">
                        {projects.map((project: Project) => (
                            <label 
                                key={project.id} 
                                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                                    selectedProjects.includes(project.id)
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 mt-1 mr-3"
                                    checked={selectedProjects.includes(project.id)}
                                    onChange={() => handleProjectSelection(project.id)}
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">{project.name}</div>
                                    <div className="text-sm text-gray-600 mt-1">{project.description}</div>
                                    <div className="text-xs text-gray-500 mt-2">
                                        Proposé par: {project.participantName}
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">
                            Projets sélectionnés: {selectedProjects.length}/3
                        </span>
                        {selectedProjects.length === 3 && (
                            <span className="text-sm text-green-600 flex items-center">
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Prêt à voter
                            </span>
                        )}
                    </div>

                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting || selectedProjects.length !== 3}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            "Enregistrement en cours..."
                        ) : (
                            `Confirmer mes votes (${selectedProjects.length}/3)`
                        )}
                    </button>
                </>
            )}
        </div>
    )
}