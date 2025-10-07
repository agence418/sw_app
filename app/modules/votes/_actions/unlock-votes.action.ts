import { useConfig } from "@/app/modules/config/store/config.store";
import {useCurrentStatus} from "@/app/modules/calendar/store/current-status.store";

export const unlockVotes = async () => {
    try {
        const response = await fetch('/api/votes/unlock', {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error('Erreur lors du déverrouillage des votes');
        }

        const data = await response.json();

        // Mettre à jour le store
        useCurrentStatus.setState(state => ({
            status: {
                ...state.status,
                votesAllowed: true
            }
        }));

        return data;
    } catch (error) {
        console.error('Erreur unlockVotes:', error);
        throw error;
    }
};
