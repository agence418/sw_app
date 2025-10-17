'use client';

import React, { useEffect, useState } from 'react';

import { BarChart3, Minus, Plus, RefreshCw, SkipForward, Trophy } from 'lucide-react';

import { useConfig } from '@/app/modules/config/store/config.store';

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
  const [_error, setError] = useState<string | null>(null);
  const { config } = useConfig((state) => state);
  const [countTeams, setCountTeams] = useState(0);
  const [customProjectCount, setCustomProjectCount] = useState<number | null>(null);

  const loadVoteResults = async () => {
    try {
      setLoading(true);
      // Charger les résultats des votes et le nombre de participants
      const [voteResponse, participantsCountResponse, coachCountResponse, visitorCountResponse] =
        await Promise.all([
          fetch('/api/votes/results'),
          fetch('/api/participants/count'),
          fetch('/api/coaches/count'),
          fetch('/api/visitor/count'),
        ]);

      if (
        !voteResponse.ok ||
        !participantsCountResponse.ok ||
        !coachCountResponse.ok ||
        !visitorCountResponse.ok
      ) {
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
    } catch (_err) {
      setError('Erreur lors du chargement des résultats');
    } finally {
      setLoading(false);
    }
  };
  const loadCountTeams = async () => {
    try {
      setCountTeams(0);
      setLoading(true);
      const response = await fetch('/api/teams/count');

      if (!response.ok) {
        throw new Error('Erreur lors du chargement');
      }

      const data = await response.json();
      setCountTeams(data);
      setError(null);
    } catch (_err) {
      setError("Erreur lors du chargement du nombre d'équipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVoteResults();
    loadCountTeams();
  }, []);

  const canVisitorsVote = config.who_can_vote.includes('visitor');
  const canCoachesVote = config.who_can_vote.includes('coach');
  const canParticipantsVote = config.who_can_vote.includes('participant');

  const visitorVotes = canVisitorsVote ? visitorCount * config.votes_per_participant : 0;
  const coachVotes = canCoachesVote ? coachCount * config.votes_per_participant : 0;
  const participantVotes = canParticipantsVote
    ? participantsCount * config.votes_per_participant
    : 0;

  // Calculs pour les statistiques
  const totalVotes = voteResults.reduce((sum, result) => sum + result.votes, 0);
  const maxPossibleVotes = visitorVotes + coachVotes + participantVotes || 1;
  const maxVotes = Math.max(...voteResults.map((r) => r.votes), 1);
  const defaultProjectCount = Math.round(participantsCount / 7); // 7 participants par équipe
  const projectsToCreate = customProjectCount ?? defaultProjectCount;

  const createTeams = async () => {
    try {
      setLoading(true);

      // Prendre les N meilleurs projets
      const topIdeas = voteResults.slice(0, projectsToCreate);

      // Supprimer toutes les équipes existantes avant de créer de nouvelles
      await fetch('/api/teams', { method: 'DELETE' });

      // Créer les équipes pour chaque projet
      const teamPromises = topIdeas.map(async (result) => {
        // D'abord récupérer le projet correspondant pour avoir le leader_id
        const projectResponse = await fetch(
          `/api/ideas?name=${encodeURIComponent(result.ideaName)}`
        );
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
              leader_id: parseInt(project.participantId),
            }),
          });
        }
      });

      const responses = await Promise.all(teamPromises.filter(Boolean));
      const allSuccessful = responses.every((response) => response?.ok);

      if (allSuccessful) {
        // Recharger les données
        await loadVoteResults();
      } else {
        alert('Erreur lors de la création de certaines équipes');
      }

      await loadCountTeams();
    } catch (_error) {
      console.error('Erreur lors de la création des équipes:', _error);
      alert('Erreur lors de la création des équipes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='mb-4 flex w-full flex-row items-center gap-2'>
        <button
          onClick={() => setCustomProjectCount(Math.max(1, projectsToCreate - 1))}
          className='flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-400'
          title='Diminuer le nombre de projets'
        >
          <Minus className='h-5 w-5' />
        </button>

        <button
          onClick={createTeams}
          className='flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50'
        >
          <>
            <div className=''>
              <div>Créer les {projectsToCreate} projets</div>
              {countTeams > 0 && (
                <div className='mt-1 text-sm'>Supprimera les {countTeams} projets existants</div>
              )}
            </div>
            <SkipForward className='ml-4 h-4 w-4' />
          </>
        </button>

        <button
          onClick={() => setCustomProjectCount(projectsToCreate + 1)}
          className='flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-400'
          title='Augmenter le nombre de projets'
        >
          <Plus className='h-5 w-5' />
        </button>
      </div>

      <div className='w-full space-y-4 px-2 md:px-4'>
        {/* Statistiques globales */}
        <div className='grid grid-cols-1 gap-3'>
          <div className='rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-black'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs text-gray-600 dark:text-gray-400'>Total votes</p>
                <div className='flex flex-row items-center gap-2'>
                  <p className='text-lg font-bold text-gray-800 dark:text-gray-200'>
                    {totalVotes}/{maxPossibleVotes}
                  </p>
                  <span className='pe-8 ps-3 text-xs text-gray-500'>
                    ({participantsCount} participants
                    {canVisitorsVote ? ' + ' + visitorCount + ' visiteurs' : ''}
                    {canCoachesVote ? ' + ' + coachVotes + ' coach' : ''} × 3 votes)
                  </span>

                  <BarChart3 className='h-6 w-6 text-blue-500' />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Résultats détaillés */}
        <div className='rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black'>
          <div className='border-b border-gray-200 p-4 dark:border-gray-800'>
            <div className='flex items-center justify-between'>
              <h2 className='flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200'>
                <Trophy className='h-4 w-4 text-yellow-500' />
                Résultats des votes
              </h2>
              <button
                onClick={loadVoteResults}
                className='flex items-center gap-1 rounded bg-gray-600 px-2 py-1 text-xs text-white transition-colors hover:bg-gray-700'
                disabled={loading}
              >
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                Rafraîchir
              </button>
            </div>
          </div>

          <div className='p-4'>
            {loading ? (
              <div className='py-8 text-center'>
                <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
                <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>Chargement...</p>
              </div>
            ) : _error ? (
              <div className='py-8 text-center text-sm text-red-600'>{_error}</div>
            ) : voteResults.length === 0 ? (
              <div className='py-8 text-center text-sm text-gray-600 dark:text-gray-400'>
                Aucun vote enregistré pour le moment
              </div>
            ) : (
              <div className='space-y-4'>
                {voteResults.map((result, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900 ${index < projectsToCreate ? 'border-l-4 border-l-green-500' : ''}`}
                  >
                    <div className='mb-2 flex items-start justify-between'>
                      <div className='min-w-0 flex-1'>
                        {index < 20 && (
                          <>
                            <h3 className='mb-2 text-sm font-semibold leading-tight text-gray-800 dark:text-gray-200'>
                              {result.ideaName}
                            </h3>
                            <div className='mb-2 flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400'>
                              <span className='font-medium'>{result.votes} votes</span>
                              <span>({result.percentage}%)</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Barre de progression */}
                    <div className='mb-3 h-6 w-full rounded-full bg-gray-200'>
                      <div
                        className={`flex h-6 items-center justify-center rounded-full text-xs font-medium text-white transition-all duration-500 dark:text-gray-900 ${
                          index === 0
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                            : index === 1
                              ? 'bg-gradient-to-r from-gray-400 to-gray-600'
                              : index === 2
                                ? 'bg-gradient-to-r from-orange-400 to-orange-600'
                                : 'bg-gradient-to-r from-blue-400 to-blue-500'
                        }`}
                        style={{ width: `${Math.max((result.votes / maxVotes) * 100, 15)}%` }}
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
