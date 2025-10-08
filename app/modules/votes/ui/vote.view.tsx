import {AlertCircle, CheckCircle2, Users} from "lucide-react";
import React, {useEffect, useState} from "react";
import {Project} from "../../projects/types/project.types";
import {useSession} from "next-auth/react";
import {useConfig} from "@/app/modules/config/store/config.store";
import {useCurrentStatus} from "@/app/modules/calendar/store/current-status.store";

export const VoteView = () => {
    const {data: session} = useSession();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [userVotes, setUserVotes] = useState<string[]>([]);
    console.log({userVotes})
    const [userHasVoted, setUserHasVoted] = useState(false);
    const [checkingVotes, setCheckingVotes] = useState(false);
    const {config} = useConfig(state => state);
    const {status} = useCurrentStatus(state => state);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (session?.user?.id) {
            checkUserVotes();
        }
    }, [session]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/projects');
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des projets:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkUserVotes = async () => {
        if (!session?.user?.id) return;

        setCheckingVotes(true);
        try {
            const response = await fetch(`/api/votes/can-vote`);
            if (response.ok) {
                const canVote = await response.json();
                setUserHasVoted(!canVote);
            }

            const votesResponse = await fetch(`/api/votes`);
            if (votesResponse.ok) {
                const votes = await votesResponse.json();
                setUserVotes(votes.map((vote: any) => vote.idea_name));
            }
        } catch (error) {
            console.error('Erreur lors de la vérification des votes:', error);
        } finally {
            setCheckingVotes(false);
        }
    };

    const toggleProjectSelection = async (projectName: string) => {
        if (!session?.user?.id) {

            setSubmitMessage({type: 'error', text: 'Vous devez être connecté pour voter'});
            setTimeout(() => setSubmitMessage(null), 3000);
            return;
        }
        const isCreation = userVotes.includes(projectName) ? 0 : 1;
        if (userVotes.length >= config.votes_per_participant && isCreation) {
            setSubmitMessage({
                type: 'error',
                text: `Vous ne pouvez voter que pour ${config.votes_per_participant} projets.`
            });
            setTimeout(() => setSubmitMessage(null), 3000);
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            const response = await fetch('/api/votes', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    projectName,
                    value: isCreation,
                })
            })

            if (response.ok) {
                setSubmitMessage({type: 'success', text: 'Vos votes ont été enregistrés avec succès!'});
                isCreation ?
                    setUserVotes([...userVotes, projectName]) :
                    setUserVotes(userVotes.filter(vote => vote !== projectName)); // ✅ !== au lieu de ===
            } else {
                setSubmitMessage({type: 'error', text: 'Erreur lors de l\'enregistrement du vote'});
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
            <div
                className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="text-center text-gray-600">Chargement des projets...</div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-500"/>
                Votes des projets
            </h2>

            <p className="text-gray-600 mb-6 text-sm dark:text-gray-400">
                Votez pour vos {config.votes_per_participant} idées préférées.
            </p>

            {submitMessage && (
                <div className={'fixed bottom-0 left-0 right-0 w-full p-4'}>
                    <div className={`p-3 rounded-lg text-sm flex items-center ${
                        submitMessage.type === 'success'
                            ? 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-white'
                            : 'bg-red-50 dark:bg-red-900 text-red-600 dark:text-white'
                    }`}>
                        {submitMessage.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 mr-2"/>
                        ) : (
                            <AlertCircle className="w-4 h-4 mr-2"/>
                        )}
                        {submitMessage.text}
                    </div>
                </div>
            )}

            {checkingVotes ? (
                <div className="text-center py-8 text-gray-500">
                    Vérification de vos votes...
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    Aucun projet disponible pour le moment
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-800 dark:text-gray-200">
                            Projets sélectionnés: {userVotes.length}/{config.votes_per_participant}
                        </span>
                    </div>

                    <div className="space-y-3 mb-6">
                        {projects.map((project: Project) => (
                            <label
                                key={project.id}
                                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                                    userVotes.includes(project.name)
                                        ? 'border-green-400 bg-green-400 dark:border-green-600 dark:bg-green-600'
                                        : 'border-gray-200 dark:border-gray-800 hover:bg-green-100 dark:hover:bg-green-800'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-500 mt-1 mr-3 opacity-0 w-0"
                                    checked={userVotes.includes(project.name)}
                                    onChange={() => toggleProjectSelection(project.name)}
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900 dark:text-white">{project.name}</div>
                                    <div
                                        className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.description}</div>
                                    <div className="text-sm text-gray-800 dark:text-gray-200 mt-2">
                                        Proposé par: {project.participantName}
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>

                    {/*<button*/}
                    {/*    onClick={handleSubmit}*/}
                    {/*    disabled={isSubmitting || !status.votesAllowed}*/}
                    {/*    className="w-full bg-green-600 dark:bg-gray-9000 text-white dark:text-gray-900 py-3 rounded-lg font-medium hover:bg-greeb-400 transition-colors disabled:opacity-50 disabled:cursor-default"*/}
                    {/*>*/}
                    {/*    {isSubmitting ? (*/}
                    {/*        "Enregistrement en cours..."*/}
                    {/*    ) : (*/}
                    {/*        `Confirmer mes votes (${userVotes.length}/${config.votes_per_participant})`*/}
                    {/*    )}*/}
                    {/*</button>*/}
                </>
            )}
        </div>
    )
}