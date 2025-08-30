'use client';

import React, {useState} from 'react';
import {Award, Calendar, Clock, Link, MessageSquare, Users, BarChart3, UserCog} from 'lucide-react';
import {CalendarView} from "./modules/calendar/ui/calendar.view";
import {getCurrentEvent} from "./modules/calendar/_actions/get-current-event.action";
import {NowView} from "./modules/calendar/ui/now.view";
import {ListParticipantsView} from "./modules/teams/ui/list-participants.view";
import {ListCoachesView} from "./modules/coach/ui/list-coaches.view";
import {VoteResultsView} from "./modules/votes/ui/vote-results.view";
import {TeamCreationView} from "./modules/teams/ui/team-creation.view";

export const StartupWeekendAdminApp = () => {
    const [activeTab, setActiveTab] = useState('accueil');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [eventEnded, setEventEnded] = useState(false);

    // Calcul de la progression du weekend
    const getWeekendProgress = () => {
        const startTime = new Date('2025-08-29T18:00:00');
        const endTime = new Date('2025-08-31T15:00:00');
        const totalDuration = endTime.getTime() - startTime.getTime();
        const elapsed = currentTime.getTime() - startTime.getTime();

        if (elapsed < 0) return 0;
        if (elapsed > totalDuration) {
            setEventEnded(true);
            return 100;
        }
        return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    };

    // Événement actuel
    const progress = getWeekendProgress();
    const currentEvent = getCurrentEvent();

    if (eventEnded) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
                    <Award className="w-16 h-16 mx-auto mb-6 text-yellow-500"/>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Merci !</h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Le Startup Weekend est terminé. Merci pour votre participation et votre engagement !
                        Nous espérons que cette expérience vous a inspiré.
                    </p>
                    <div className="text-sm text-gray-500">
                        Restez connectés pour les prochains événements !
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-green-600 text-white p-4 shadow-lg">
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
                        {id: 'participants', icon: Users, label: 'Participants'},
                        {id: 'coaches', icon: UserCog, label: 'Coachs'},
                        {id: 'votes', icon: BarChart3, label: 'Votes'},
                        {id: 'calendrier', icon: Calendar, label: 'Calendrier'},
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
                        {getCurrentEvent()?.title === 'Présentation des idées (60 secondes/idée)' ? <TeamCreationView /> :
                            <>
                                <NowView/>
                            </>
                        }
                    </>
                )}

                {/* Gestion des participants */}
                {activeTab === 'participants' && (
                    <ListParticipantsView/>
                )}

                {/* Gestion des coachs */}
                {activeTab === 'coaches' && (
                    <ListCoachesView/>
                )}

                {/* Résultats des votes */}
                {activeTab === 'votes' && (
                    <VoteResultsView/>
                )}

                {/* Calendrier */}
                {activeTab === 'calendrier' && (
                    <CalendarView/>
                )}
            </main>

            {/* Status bar en bas */}
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

            {/* Padding pour éviter que le contenu soit masqué par la status bar */}
            <div className="h-20"/>
        </div>
    );
}
