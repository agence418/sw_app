'use client';

import React, {useEffect, useState} from 'react';
import {ArrowRight, BarChart3, RefreshCw, Trophy} from 'lucide-react';
import {useConfig} from "@/app/modules/config/store/config.store";

interface VoteResult {
    ideaName: string;
    votes: number;
    percentage: number;
    voters: string[];
}

export const VoteResultsView = () => {
    const [voteResults, setVoteResults] = useState<VoteResult[]>([]);
    const [participantsCount, setParticipantsCount] = useState<number>(0);
    const [coachCount, setCoachCount] = useState<number>(0);
    const [visitorCount, setVisitorCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {config} = useConfig(state => state);

    const loadVoteResults = async () => {
        try {
            setLoading(true);
            // Charger les résultats des votes et le nombre de participants
            const [voteResponse, participantsCountResponse, coachCountResponse, visitorCountResponse] = await Promise.all([
                fetch('/api/votes/results'),
                fetch('/api/participants/count'),
                fetch('/api/coaches/count'),
                fetch('/api/visitor/count')
            ]);

            if (!voteResponse.ok || !participantsCountResponse.ok || !coachCountResponse.ok || !visitorCountResponse.ok) {
                throw new Error('Erreur lors du chargement');
            }

            const voteData = await voteResponse.json();
            const participantsCount = await participantsCountResponse.json();
            const coachCount = await coachCountResponse.json();
            const visitorCount = await visitorCountResponse.json();

            setVoteResults(voteData);
            setParticipantsCount(participantsCount);
            setCoachCount(coachCount);
            setVisitorCount(visitorCount);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des résultats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVoteResults();
    }, []);


    const canVisitorsVote = config.who_can_vote.includes('visitor');
    const canCoachesVote = config.who_can_vote.includes('coach');
    const canParticipantsVote = config.who_can_vote.includes('participant');

    const visitorVotes = canVisitorsVote ? visitorCount * config.votes_per_participant : 0;
    const coachVotes = canCoachesVote ? coachCount * config.votes_per_participant : 0;
    const participantVotes = canParticipantsVote ? participantsCount * config.votes_per_participant : 0;


    // Calculs pour les statistiques
    const totalVotes = voteResults.reduce((sum, result) => sum + result.votes, 0);
    const maxPossibleVotes = (visitorVotes + coachVotes + participantVotes) || 1;
    const maxVotes = Math.max(...voteResults.map(r => r.votes), 1);
    const projectsToCreate = Math.round(participantsCount / 7); // 7 participants par équipe

    const createTeams = async () => {
        try {
            setLoading(true);

            // Calculer le nombre d'équipes à créer (arrondi)
            const numberOfTeams = Math.round(projectsToCreate);

            // Prendre les N meilleurs projets
            const topIdeas = voteResults.slice(0, numberOfTeams);

            // Créer les équipes pour chaque projet
            const teamPromises = topIdeas.map(async (result) => {
                // D'abord récupérer le projet correspondant pour avoir le leader_id
                const projectResponse = await fetch(`/api/projects?name=${encodeURIComponent(result.ideaName)}`);
                const projects = await projectResponse.json();
                const project = projects.find((p: any) => p.name === result.ideaName);

                if (project) {
                    // Créer l'équipe
                    return fetch('/api/teams', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            name: `Équipe ${result.ideaName}`,
                            idea_description: project.description,
                            leader_id: parseInt(project.participantId)
                        })
                    });
                }
            });

            const responses = await Promise.all(teamPromises.filter(Boolean));
            const allSuccessful = responses.every(response => response?.ok);

            if (allSuccessful) {
                alert(`${numberOfTeams} équipes créées avec succès !`);
                // Recharger les données
                await loadVoteResults();
            } else {
                alert('Erreur lors de la création de certaines équipes');
            }
        } catch (error) {
            console.error('Erreur lors de la création des équipes:', error);
            alert('Erreur lors de la création des équipes');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button
                onClick={createTeams}
                className="mb-4 w-full bg-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                <>
                    Créer les {projectsToCreate} projets
                    <ArrowRight className="w-4 h-4 ml-4"/>
                </>
            </button>

            <div className="w-full px-2 md:px-4 space-y-4">
                {/* Statistiques globales */}
                <div className="grid grid-cols-1 gap-3">
                    <div className="bg-white dark:bg-black rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Total votes</p>
                                <div className="flex flex-row gap-2 items-center">
                                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{totalVotes}/{maxPossibleVotes}
                                    </p>
                                    <span
                                        className="text-xs text-gray-500 ps-3 pe-8">({participantsCount} participants{canVisitorsVote ? ' + ' + visitorCount + ' visiteurs' : ''}{canCoachesVote ? ' + ' + coachVotes + ' coach' : ''} × 3 votes)</span>


                                    <BarChart3 className="w-6 h-6 text-blue-500"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Résultats détaillés */}
                <div
                    className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-yellow-500"/>
                                Résultats des votes
                            </h2>
                            <button
                                onClick={loadVoteResults}
                                className="flex items-center gap-1 bg-gray-600 text-white  px-2 py-1 rounded hover:bg-gray-700 transition-colors text-xs"
                                disabled={loading}
                            >
                                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`}/>
                                Rafraîchir
                            </button>
                        </div>
                    </div>

                    <div className="p-4">
                        {loading ? (
                            <div className="text-center py-8">
                                <div
                                    className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">Chargement...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8 text-red-600 text-sm">
                                {error}
                            </div>
                        ) : voteResults.length === 0 ? (
                            <div className="text-center py-8 text-gray-600 dark:text-gray-400 text-sm">
                                Aucun vote enregistré pour le moment
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {voteResults.map((result, index) => (
                                    <div key={index}
                                         className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1 min-w-0">
                                                {index < 10 && (
                                                    <>
                                                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm leading-tight mb-2">
                                                            {result.ideaName}
                                                        </h3>
                                                        <div
                                                            className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mb-2">
                                                            <span className="font-medium">{result.votes} votes</span>
                                                            <span>({result.percentage}%)</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Barre de progression */}
                                        <div className="w-full bg-gray-200 rounded-full h-6 mb-3">
                                            <div
                                                className={`h-6 rounded-full flex items-center justify-center text-white dark:text-gray-900 text-xs font-medium transition-all duration-500 ${
                                                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                                                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                                                            index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                                                                'bg-gradient-to-r from-blue-400 to-blue-500'
                                                }`}
                                                style={{width: `${Math.max((result.votes / maxVotes) * 100, 15)}%`}}
                                            >
                                                {result.percentage}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};