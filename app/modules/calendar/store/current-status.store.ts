import {create} from 'zustand';
import {Event} from '../types/event.type';

type CurrentStatus = {
    loading: boolean;
    error?: string;
    success?: string;
    status: {
        currentEvent?: Event;
        previousEvent?: Event;
        nextEvent?: Event;
        nextCTA?: string;
        defaultEvent?: Event;
        autoAdvance?: boolean;
        votesAllowed: boolean;
    }
}

export const useCurrentStatus = create<CurrentStatus>(() => ({
    loading: false,
    status: {
        votesAllowed: false,
        autoAdvance: true,
    }
}));
