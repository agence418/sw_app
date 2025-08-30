'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Trophy, Calendar, RefreshCw } from 'lucide-react';

interface VoteResult {
    ideaName: string;
    votes: number;
    percentage: number;
    voters: string[];
}

export const VoteResultsView = () => {
    const [voteResults, setVoteResults] = useState<VoteResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadVoteResults = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/votes/results');
            if (!response.ok) throw new Error('Erreur lors du chargement');
            const data = await response.json();
            setVoteResults(data);
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
    const maxVotes = Math.max(...voteResults.map(r => r.votes), 1);

    return (
        <div className="w-full px-2 md:px-4 space-y-4">
            {/* Statistiques globales */}
            <div className="grid grid-cols-1 gap-3">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Total votes</p>
                            <p className="text-lg font-bold text-gray-800">{totalVotes}/{maxVotes}</p>
                        </div>
                        <BarChart3 className="w-6 h-6 text-blue-500" />
                    </div>
                </div>
            </div>

            {/* Résultats détaillés */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            Résultats des votes
                        </h2>
                        <button
                            onClick={loadVoteResults}
                            className="flex items-center gap-1 bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors text-xs"
                            disabled={loading}
                        >
                            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                            Rafraîchir
                        </button>
                    </div>
                </div>

                <div className="p-4">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
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
                                                    <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
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
                                            style={{ width: `${Math.max((result.votes / maxVotes) * 100, 15)}%` }}
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

                <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                        <p className="font-medium mb-1">Informations:</p>
                        <ul className="space-y-1">
                            <li>• Top 3 idées développées ce weekend</li>
                            <li>• Équipes formées autour de ces projets</li>
                            <li>• Vote vendredi soir après pitchs</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};