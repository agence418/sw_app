'use client';

import React, {useMemo, useState} from 'react';
import {
    BarChart3,
    Calendar,
    Clock,
    GraduationCap,
    HardHat,
    HatGlasses,
    Lock,
    LockOpen,
    Play,
    Settings,
    SkipBack,
    SkipForward,
    Users
} from 'lucide-react';
import {CalendarView} from "./modules/calendar/ui/calendar.view";
import {NowView} from "./modules/calendar/ui/now.view";
import {ListParticipantsView} from "./modules/teams/ui/list-participants.view";
import {ListCoachesView} from "./modules/coach/ui/list-coaches.view";
import {VoteResultsView} from "./modules/votes/ui/vote-results.view";
import {TeamCreationView} from "./modules/teams/ui/team-creation.view";
import {ListTeamsView} from "./modules/teams/ui/list-teams.view";
import {ListVisitorsView} from "./modules/visitors/ui/list-visitors.view";
import {ConfigView} from "./modules/config/ui/config.view";
import {useConfig} from "@/app/modules/config/store/config.store";
import {useCurrentStatus} from "@/app/modules/calendar/store/current-status.store";
import {getCurrentDay} from "@/app/modules/calendar/helpers/get-current-day.action";
import {backEvent} from "@/app/modules/calendar/_actions/back-event.action";
import {advanceEvent} from "@/app/modules/calendar/_actions/advance-event.action";
import {setAutoEvent} from "@/app/modules/calendar/_actions/set-auto-event.action";

export const StartupWeekendAdminApp = () => {
    const [activeTab, setActiveTab] = useState('accueil');
    const [currentTime, setCurrentTime] = useState(new Date());
    const {config} = useConfig((state) => state);
    const {status} = useCurrentStatus((state) => state);
    const {currentEvent, defaultEvent} = status;


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

    const handleNextEvent = () => {
        try {
            advanceEvent();
        } catch (error) {
            console.error(error);
            alert('Erreur lors du passage à l\'événement suivant');
        }
    };

    const handlePreviousEvent = () => {
        try {
            backEvent();
        } catch (error) {
            console.error(error);
            alert('Erreur lors du retour à l\'événement précédent');
        }
    };

    const handleAutoEvent = () => {
        try {
            setAutoEvent();
        } catch (error) {
            console.error(error);
            alert('Erreur lors du retour à l\'événement précédent');
        }
    }

    const handleUnlockVotes = async (showAlert: boolean = false) => {
        try {
            useCurrentStatus.setState({status: {...status, votesAllowed: true}});
            const response = await fetch('/api/votes/unlock', {method: 'POST'});
            if (!response.ok) throw new Error('Erreur lors du déverrouillage des votes');
        } catch (error) {
            console.error(error);
            if (showAlert) alert('Erreur lors du déverrouillage des votes');
        }
    };

    const handleLockVotes = async (showAlert: boolean = false) => {
        try {
            useCurrentStatus.setState({status: {...status, votesAllowed: false}});
            const response = await fetch('/api/votes/lock', {method: 'POST'});
            if (!response.ok) throw new Error('Erreur lors du verrouillage des votes');
        } catch (error) {
            console.error(error);
            if (showAlert) alert('Erreur lors du verrouillage des votes');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                            className="bg-white dark:bg-black rounded-full h-2 transition-all duration-500"
                            style={{width: `${progress}%`}}
                        />
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav
                className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 px-4 bottom-[53px] left-0 w-full">
                <div className="flex overflow-x-auto justify-between space-x-1 py-2">
                    {[
                        {id: 'accueil', icon: Clock, label: 'Accueil'},
                        {id: 'participants', icon: HardHat, label: 'Participants'},
                        {id: 'visitors', icon: HatGlasses, label: 'Visiteurs'},
                        {id: 'coaches', icon: GraduationCap, label: 'Coachs'},
                        {id: 'teams', icon: Users, label: 'Teams'},
                        {id: 'votes', icon: BarChart3, label: 'Votes'},
                        {id: 'calendrier', icon: Calendar, label: 'Calendrier'},
                        {id: 'config', icon: Settings, label: 'Config'},
                    ].map(({id, icon: Icon, label}) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex flex-col items-center p-2 rounded-lg min-w-0 flex-shrink-0 ${
                                activeTab === id ? 'bg-green-600 text-white' : 'text-gray-600 dark:text-gray-400'
                            }`}
                        >
                            <Icon className="w-5 h-5 mb-1"/>
                            <span className="text-xs font-medium">{label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Contenu principal */}
            <main className="p-3">
                <div className="flex flex-col sm:flex-row gap-2 pt-2 pb-4">
                    <div className={'flex flex-row w-full gap-2'}>
                        {currentEvent?.step > 0 && (
                            <button
                                onClick={() => handlePreviousEvent()}
                                className="flex items-center justify-center gap-2 text-white px-3 py-2 rounded-lg bg-red-600 hover:bg-red-400 transition-colors"
                            >
                                Back
                                <SkipBack className="w-4 h-4"/>
                            </button>
                        )}
                        {/*<button*/}
                        {/*    onClick={() => handleAutoEvent()}*/}
                        {/*    className={`basis-[100%] flex items-center justify-center gap-2 text-white px-3 py-2 rounded-lg bg-green-600 hover:bg-green-400 transition-colors ${status.autoAdvance ? 'opacity-50' : ''}`}*/}
                        {/*    disabled={status.autoAdvance}*/}
                        {/*>*/}
                        {/*    <span className="">*/}
                        {/*    Auto*/}
                        {/*    <div className={'text-xs'}>({defaultEvent?.title ?? 'Pas d\'événement'})</div>*/}
                        {/*    </span>*/}
                        {/*    <Play className="w-4 h-4"/>*/}
                        {/*</button>*/}
                        <button
                            onClick={() => handleNextEvent()}
                            className="basis-[100%] flex items-center justify-center gap-2 text-white px-3 py-2 rounded-lg bg-green-600 hover:bg-green-400 transition-colors"
                        >
                            {!currentEvent ? 'Start' : currentEvent?.nextCTA ?? 'Next'}
                            <SkipForward className="w-4 h-4"/>
                        </button>
                    </div>

                    {getCurrentDay() === 'samedi' && (
                        <>
                            {!status.votesAllowed ? (
                                <button
                                    onClick={() => handleUnlockVotes(true)}
                                    className="flex items-center justify-center gap-2 text-white px-3 py-2 rounded-lg bg-green-600 hover:bg-green-400 transition-colors"
                                >
                                    <LockOpen className="w-4 h-4"/>
                                    Autoriser les votes
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleLockVotes(true)}
                                    className="flex items-center justify-center gap-2 text-white px-3 py-2 rounded-lg bg-green-600 hover:bg-green-400 transition-colors"
                                >
                                    <Lock className="w-4 h-4"/>
                                    Vérouiller les votes
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Page d'accueil */}
                {activeTab === 'accueil' && (
                    <>
                        {currentEvent?.title === 'Présentation des idées (60 secondes/idée)' ?
                            <TeamCreationView/> :
                            currentEvent?.title === 'Votes' ? <VoteResultsView/> :
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


                {/* Gestion des visitors */}
                {activeTab === 'visitors' && (
                    <ListVisitorsView/>
                )}

                {/* Gestion des coachs */}
                {activeTab === 'coaches' && (
                    <ListCoachesView/>
                )}

                {/* Gestion des participants */}
                {activeTab === 'teams' && (
                    <ListTeamsView/>
                )}

                {/* Résultats des votes */}
                {activeTab === 'votes' && (
                    <VoteResultsView/>
                )}

                {/* Calendrier */}
                {activeTab === 'calendrier' && (
                    <CalendarView/>
                )}

                {/* Configuration */}
                {activeTab === 'config' && (
                    <ConfigView/>
                )}
            </main>

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
