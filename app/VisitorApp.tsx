'use client';

import React, {useEffect, useMemo, useState} from 'react';
import {Link as LinkIcon} from 'lucide-react';
import {getCurrentEvent} from "./modules/calendar/_actions/get-current-event.action";
import {VoteView} from "./modules/votes/ui/vote.view";
import Link from 'next/link';
import {useConfig} from "@/app/modules/config/store/config.store";

export const VisitorApp = () => {
    const [activeTab, setActiveTab] = useState('accueil');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [eventEnded, setEventEnded] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<any>(null);
    const {config} = useConfig((state) => state)

    // Calcul de la progression du weekend
    const progress = useMemo(() => {
        const startTime = new Date(config.event_start_date ?? '2025-09-05T18:00:00');
        const endTime = new Date(config.event_start_date ?? '2025-09-07T15:00:00');
        const totalDuration = endTime.getTime() - startTime.getTime();
        const elapsed = currentTime.getTime() - startTime.getTime();

        if (elapsed < 0) return 0;
        if (elapsed > totalDuration) return 100;
        return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    }, [currentTime]);

    // Vérifier si l'événement est terminé
    useEffect(() => {
        console.log({config})
        const startTime = new Date(config.event_start_date ?? '2025-09-05T18:00:00');
        const endTime = new Date(config.event_start_date ?? '2025-09-07T15:00:00');
        const elapsed = currentTime.getTime() - startTime.getTime();
        const totalDuration = endTime.getTime() - startTime.getTime();

        if (elapsed > totalDuration) {
            setEventEnded(true);
        }
    }, [currentTime]);

    // Récupérer l'événement actuel
    useEffect(() => {
        const fetchCurrentEvent = async () => {
            const event = await getCurrentEvent();
            setCurrentEvent(event);
        };
        fetchCurrentEvent();

        // Rafraîchir toutes les minutes
        const interval = setInterval(fetchCurrentEvent, 60000);
        return () => clearInterval(interval);
    }, []);

    if (eventEnded) {
        return (
            <div
                className="min-h-screen text-white bg-green-600 to-cyan-500 flex items-center justify-center p-4">
                <div className="backdrop-blur-sm rounded-3xl p-8 max-w-md w-full text-center">
                    <h1 className="text-3xl font-bold mb-4">Merci !</h1>
                    <p className="text-lg mb-6">
                        Le Startup Weekend est terminé.
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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-red-600 text-white p-4 shadow-lg">
                <h1 className="text-xl font-bold text-center">Startup Weekend</h1>
            </header>

            {/* Navigation */}
            {/*<nav className="bg-white border-b border-gray-200 px-4">*/}
            {/*    <div className="flex overflow-x-auto justify-between space-x-1 py-2">*/}
            {/*        {[*/}
            {/*            {id: 'accueil', icon: Clock, label: 'Accueil'}*/}
            {/*        ].map(({id, icon: Icon, label}) => (*/}
            {/*            <button*/}
            {/*                key={id}*/}
            {/*                onClick={() => setActiveTab(id)}*/}
            {/*                className={`flex flex-col items-center p-2 rounded-lg min-w-0 flex-shrink-0 ${*/}
            {/*                    activeTab === id ? 'bg-blue-100 text-blue-600' : 'text-gray-600'*/}
            {/*                }`}*/}
            {/*            >*/}
            {/*                <Icon className="w-5 h-5 mb-1"/>*/}
            {/*                <span className="text-xs font-medium">{label}</span>*/}
            {/*            </button>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</nav>*/}

            {/* Contenu principal */}
            <main className="p-4">
                {/* Page d'accueil */}
                {activeTab === 'accueil' && (
                    <>
                        {currentEvent?.title === 'Votes' ? <VoteView/> :

                            <div className="space-y-6">
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-semibold flex items-center">
                                        <LinkIcon className="w-5 h-5 mr-2 text-blue-600"/>
                                        Stay connected !
                                    </h2>
                                </div>
                            </div>
                        }
                    </>
                )}
            </main>

            {/* Status bar en bas */}
            {progress > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                    <div className="text-center text-sm text-gray-600">
                        {currentEvent ? (
                            <div>
                                <span className="font-medium text-blue-600">En cours:</span> {currentEvent.title}
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
