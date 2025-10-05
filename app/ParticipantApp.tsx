'use client';

import React, {useState, useMemo, useEffect} from 'react';
import {Calendar, Clock, Link, MessageSquare} from 'lucide-react';
import {CalendarView} from "./modules/calendar/ui/calendar.view";
import {getCurrentEvent} from "./modules/calendar/_actions/get-current-event.action";
import {VoteView} from "./modules/votes/ui/vote.view";
import {NowView} from "./modules/calendar/ui/now.view";
import {SendFileComp} from "./modules/powerpoint/ui/send-file.comp";
import {ChooseCoachView} from "./modules/coach/ui/choose-coach.view";
import {withLogin} from "./modules/auth/ui/with-login.hoc";
import {SessionProvider} from "./modules/auth/providers/session.provider";
import {ToolsView} from "./modules/tools/ui/tools.view";

export const ParticipantApp = () => {
    const [activeTab, setActiveTab] = useState('accueil');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [eventEnded, setEventEnded] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<any>(null);

    // Calcul de la progression du weekend
    const progress = useMemo(() => {
        const startTime = new Date('2025-09-05T18:00:00');
        const endTime = new Date('2025-09-07T15:00:00');
        const totalDuration = endTime.getTime() - startTime.getTime();
        const elapsed = currentTime.getTime() - startTime.getTime();

        if (elapsed < 0) return 0;
        if (elapsed > totalDuration) return 100;
        return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    }, [currentTime]);

    // Vérifier si l'événement est terminé
    useEffect(() => {
        const startTime = new Date('2025-09-05T18:00:00');
        const endTime = new Date('2025-09-07T15:00:00');
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
                        Le Startup Weekend est terminé. Merci pour votre participation !
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
                <div className="mt-2">
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span>Progression</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                            className="bg-white rounded-full h-2 transition-all duration-500"
                            style={{width: `${progress}%`}}
                        />
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 px-4">
                <div className="flex overflow-x-auto justify-between space-x-1 py-2">
                    {[
                        {id: 'accueil', icon: Clock, label: 'Accueil'},
                        {id: 'calendrier', icon: Calendar, label: 'Calendrier'},
                        {id: 'coach', icon: MessageSquare, label: 'Coach'},
                        {id: 'outils', icon: Link, label: 'Outils'}
                    ].map(({id, icon: Icon, label}) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex flex-col items-center p-2 rounded-lg min-w-0 flex-shrink-0 ${
                                activeTab === id ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                            }`}
                        >
                            <Icon className="w-5 h-5 mb-1"/>
                            <span className="text-xs font-medium">{label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Contenu principal */}
            <main className="p-4">
                {/* Page d'accueil */}
                {activeTab === 'accueil' && (
                    <>
                        {currentEvent?.title === 'Votes' ? <VoteView/> :
                            <>
                                <NowView/>
                                {currentTime.getDay() == 4 && (
                                    <SendFileComp/>
                                )}
                            </>
                        }
                    </>
                )}

                {/* Calendrier */}
                {activeTab === 'calendrier' && (
                    <CalendarView/>
                )}

                {/* Formulaire coach */}
                {activeTab === 'coach' && (
                    <ChooseCoachView/>
                )}

                {/* Outils pratiques */}
                {activeTab === 'outils' && (
                    <ToolsView />
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