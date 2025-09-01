'use client';

import React, {useEffect, useState} from 'react';
import {ArrowRight, BarChart3, RefreshCw, Trophy} from 'lucide-react';

interface VoteResult {
    ideaName: string;
    votes: number;
    percentage: number;
    voters: string[];
}

export const VoteResultsView = () => {
    const [voteResults, setVoteResults] = useState<VoteResult[]>([]);
    const [participantsCount, setParticipantsCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadVoteResults = async () => {
        try {
            setLoading(true);
            // Charger les résultats des votes et le nombre de participants
            const [voteResponse, participantsResponse] = await Promise.all([
                fetch('/api/votes/results'),
                fetch('/api/participants')
            ]);

            if (!voteResponse.ok || !participantsResponse.ok) {
                throw new Error('Erreur lors du chargement');
            }

            const voteData = await voteResponse.json();
            const participantsData = await participantsResponse.json();

            setVoteResults(voteData);
            setParticipantsCount(participantsData.length);
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

    const totalVotes = voteResults.reduce((sum, result) => sum + result.votes, 0);
    const maxPossibleVotes = participantsCount * 3; // Chaque participant a 3 votes
    const maxVotes = Math.max(...voteResults.map(r => r.votes), 1);
    const projectsToCreate = Math.round(maxPossibleVotes/3/7); // 3 votes par participant, 7 participants par équipe

    const createTeams = async () => {
        try {
            setLoading(true);
            
            // Calculer le nombre d'équipes à créer (arrondi)
            const numberOfTeams = Math.round(projectsToCreate);
            
            // Prendre les N meilleurs projets
            const topProjects = voteResults.slice(0, numberOfTeams);
            
            // Créer les équipes pour chaque projet
            const teamPromises = topProjects.map(async (result) => {
                // D'abord récupérer le projet correspondant pour avoir le leader_id
                const projectResponse = await fetch(`/api/projects?name=${encodeURIComponent(result.ideaName)}`);
                const projects = await projectResponse.json();
                const project = projects.find((p: any) => p.name === result.ideaName);
                
                if (project) {
                    // Créer l'équipe
                    return fetch('/api/teams', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
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
                    Valider les {projectsToCreate} projets
                    <ArrowRight className="w-4 h-4 ml-4"/>
                </>
            </button>

            <div className="w-full px-2 md:px-4 space-y-4">
                {/* Statistiques globales */}
                <div className="grid grid-cols-1 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Total votes</p>
                                <p className="text-lg font-bold text-gray-800">{totalVotes}/{maxPossibleVotes}
                                    <span className="text-xs text-gray-500 ps-3">({participantsCount} participants × 3 votes)</span>
                                </p>
                            </div>
                            <BarChart3 className="w-6 h-6 text-blue-500"/>
                        </div>
                    </div>
                </div>

                {/* Résultats détaillés */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-yellow-500"/>
                                Résultats des votes
                            </h2>
                            <button
                                onClick={loadVoteResults}
                                className="flex items-center gap-1 bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors text-xs"
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
                                    className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600 text-sm">Chargement...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8 text-red-600 text-sm">
                                {error}
                            </div>
                        ) : voteResults.length === 0 ? (
                            <div className="text-center py-8 text-gray-600 text-sm">
                                Aucun vote enregistré pour le moment
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {voteResults.map((result, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1 min-w-0">
                                                {index < 10 && (
                                                    <>
                                                        <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-2">
                                                            {result.ideaName}
                                                        </h3>
                                                        <div
                                                            className="flex items-center gap-3 text-xs text-gray-600 mb-2">
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
                                                className={`h-6 rounded-full flex items-center justify-center text-white text-xs font-medium transition-all duration-500 ${
                                                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                                                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                                                            index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                                                                'bg-gradient-to-r from-blue-400 to-blue-600'
                                                }`}
                                                style={{width: `${Math.max((result.votes / maxVotes) * 100, 15)}%`}}
                                            >
                                                {result.percentage}%
                                            </div>
                                        </div>

                                        {/* Liste des votants */}
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Votants:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {result.voters.map((voter, vIndex) => (
                                                    <span
                                                        key={vIndex}
                                                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                                                    >
                                                    {voter}
                                                </span>
                                                ))}
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