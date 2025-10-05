import {create} from 'zustand';

type Config = {
    loading: boolean;
    error?: string;
    success?: string;
    config: {
        event_start_date: string;
        allow_visitor_registration: boolean;
        allow_visitor_accounts: boolean;
        who_can_vote: string[];
        votes_per_participant: number;
    }
}

export const useConfig = create<Config>(() => ({
    loading: false,
    config: {
        event_start_date: '2025-09-05T18:00:00',
        allow_visitor_registration: false,
        allow_visitor_accounts: false,
        who_can_vote: ['participant'],
        votes_per_participant: 3
    }
}));