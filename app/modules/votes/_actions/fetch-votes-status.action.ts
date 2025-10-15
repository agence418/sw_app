import { useCurrentStatus } from '@/app/modules/calendar/store/current-status.store';

export const fetchVotesStatus = async () => {
  try {
    const response = await fetch('/api/votes/status');

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du statut des votes');
    }

    const data = await response.json();

    // Mettre à jour le store
    useCurrentStatus.setState((state) => ({
      status: {
        ...state.status,
        votesAllowed: data.votesAllowed,
      },
    }));

    return data;
  } catch (_error) {
    console.error('Erreur fetchVotesStatus:', _error);
    throw _error;
  }
};
