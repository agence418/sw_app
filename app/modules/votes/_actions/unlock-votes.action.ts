import { useCurrentStatus } from '@/app/modules/calendar/store/current-status.store';

export const unlockVotes = async () => {
  try {
    const response = await fetch('/api/votes/unlock', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Erreur lors du déverrouillage des votes');
    }

    const data = await response.json();

    // Mettre à jour le store
    useCurrentStatus.setState((state) => ({
      status: {
        ...state.status,
        votesAllowed: true,
      },
    }));

    return data;
  } catch (_error) {
    console.error('Erreur unlockVotes:', _error);
    throw _error;
  }
};
