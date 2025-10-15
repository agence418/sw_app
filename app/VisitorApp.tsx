'use client';

import React, {useMemo, useState} from 'react';
import {Link as LinkIcon} from 'lucide-react';
import {VoteView} from "./modules/votes/ui/vote.view";
import Link from 'next/link';
import {useConfig} from "@/app/modules/config/store/config.store";
import {useCurrentStatus} from "@/app/modules/calendar/store/current-status.store";

export const VisitorApp = () => {
    const [activeTab, setActiveTab] = useState('accueil');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [eventEnded, setEventEnded] = useState(false);
    const {status} = useCurrentStatus(state => state);
    const {currentEvent} = status;
    const {config} = useConfig((state) => state)

    // Mettre à jour l'heure actuelle toutes les minutes
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // 60 secondes
        return () => clearInterval(interval);
    }, []);

    // Calcul de la progression du weekend
    const progress = useMemo(() => {
        setEventEnded(false)
        const startTime = new Date(config.event_start_date ?? '2025-09-05T18:00:00');
        startTime.setHours(18, 0, 0, 0); // Forcer à 18h00
        const endTime = new Date(startTime);
        endTime.setDate(startTime.getDate() + 2);
        endTime.setHours(15, 0, 0, 0); // Dimanche 15h
        const totalDuration = endTime.getTime() - startTime.getTime();
        const elapsed = currentTime.getTime() - startTime.getTime();

        if (elapsed < 0) return 0;
        if (elapsed > totalDuration) {
            setEventEnded(true);
            return 100;
        }
        return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    }, [currentTime, config]);

    if (status.currentEvent?.step > 3) {
        return (
            <div
                className="min-h-screen text-white dark:text-gray-900 bg-green-600 to-cyan-500 flex items-center justify-center p-4">
                <div className="backdrop-blur-sm rounded-3xl p-8 max-w-md w-full text-center">
                    <h1 className="text-3xl font-bold mb-4">Merci !</h1>
                    <p className="text-lg mb-6">
                        Les votes sont terminés.<br/>
                        Merci d'avoir participé !
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-4 text-sm">
                    <p className={'text-center text-white'}>
                        Application réalisée par : <br/>
                        <Link href={'https://agence418.fr'}>
                            Agence 418
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-pink-600 text-white p-4 shadow-lg">
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
                {activeTab === 'accueil' && (
                    <>
                        {status.votesAllowed && config.who_can_vote.includes('visitor') ? <VoteView/> :
                            <div className="space-y-6">
                                <div
                                    className="rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                                    <h2 className={`text-lg font-semibold flex items-center ${config.who_can_vote.includes('visitor') ? 'mb-4' : ''}`}>
                                        <LinkIcon className="w-5 h-5 mr-2 text-green-600"/>
                                        Restez connecté !
                                    </h2>
                                    {config.who_can_vote.includes('visitor') && (
                                        <div className="text-gray-500">Vous pourrez bientôt
                                            voter pour vos projets favoris
                                        </div>
                                    )}
                                </div>
                            </div>
                        }
                    </>
                )}
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
