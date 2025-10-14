'use client';

import React, {useMemo, useState} from 'react';
import {ListTeamsView} from "./modules/user-managment/participants/ui/list-teams.view";
import {useConfig} from "@/app/modules/config/store/config.store";
import {useCurrentStatus} from "@/app/modules/calendar/store/current-status.store";
import {VoteView} from "@/app/modules/votes/ui/vote.view";

export const StartupWeekendCoachApp = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [eventEnded, setEventEnded] = useState(false);

    const {status} = useCurrentStatus(state => state);
    const {currentEvent} = status;
    const {config} = useConfig((state) => state)

    // Calcul de la progression du weekend
    const progress = useMemo(() => {
        setEventEnded(false)
        const startTime = new Date(config.event_start_date ?? '2025-09-05T18:00:00');
        const endTime = new Date(config.event_start_date ?? '2025-09-07T15:00:00');
        const totalDuration = endTime.getTime() - startTime.getTime();
        const elapsed = currentTime.getTime() - startTime.getTime();

        if (elapsed < 0) return 0;
        if (elapsed > totalDuration) {
            setEventEnded(true);
            return 100;
        }
        return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    }, [currentTime, config]);

    if (status.currentEvent?.step > 7) {
        return (
            <div
                className="min-h-screen text-white bg-green-600 to-cyan-500 flex items-center justify-center p-4">
                <div className="backdrop-blur-sm rounded-3xl p-8 max-w-md w-full text-center">
                    <h1 className="text-3xl font-bold mb-4">Félicitations !</h1>
                    <p className="text-lg mb-6">
                        Vous l'avez fait !
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-purple-600 text-white p-4 shadow-lg">
                <h1 className="text-xl font-bold text-center">Startup Weekend</h1>
                <div className="mt-2">
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span>Progression</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                            className="bg-white dark:bg-black rounded-full h-2 transition-all duration-500"
                            style={{width: `${progress}%`}}
                        />
                    </div>
                </div>
            </header>

            {/* Contenu principal */}
            <main className="p-4">
                {/* Page d'accueil */}
                {status.votesAllowed && config.who_can_vote.includes('coach') ? <VoteView/> :
                    <ListTeamsView/>
                }
            </main>

            {/* Status bar en bas */}
            {progress > 0 && (
                <div
                    className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-center text-sm text-gray-600">
                        {currentEvent ? (
                            <div>
                                <span className="font-medium text-blue-500">En cours:</span> {currentEvent.title}
                            </div>
                        ) : (
                            'Startup Weekend en cours...'
                        )}
                    </div>
                </div>
            )}

            {/* Padding pour éviter que le contenu soit masqué par la status bar */}
            <div className="h-20"/>
        </div>
    );
}
