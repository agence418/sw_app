import { useCurrentStatus } from '@/app/modules/calendar/store/current-status.store';

export const lockVotes = async () => {
  try {
    const response = await fetch('/api/votes/lock', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Erreur lors du verrouillage des votes');
    }

    const data = await response.json();

    // Mettre à jour le store
    useCurrentStatus.setState((state) => ({
      status: {
        ...state.status,
        votesAllowed: false,
      },
    }));

    return data;
  } catch (_error) {
    console.error('Erreur lockVotes:', _error);
    throw _error;
  }
};
