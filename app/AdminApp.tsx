'use client';

import React, {useEffect, useMemo, useState} from 'react';
import {
    BarChart3,
    Calendar,
    Clock,
    GraduationCap,
    HardHat,
    HatGlasses,
    Lock,
    LockOpen,
    Settings,
    SkipBack,
    SkipForward,
    Users
} from 'lucide-react';
import {CalendarView} from "./modules/calendar/ui/calendar.view";
import {NowView} from "./modules/calendar/ui/now.view";
import {ListParticipantsView} from "./modules/user-managment/participants/ui/list-participants.view";
import {ListCoachesView} from "./modules/user-managment/coach/ui/list-coaches.view";
import {VoteResultsView} from "./modules/votes/ui/vote-results.view";
import {IdeaCreationView} from "./modules/user-managment/participants/ui/idea-creation.view";
import {ListTeamsView} from "./modules/user-managment/participants/ui/list-teams.view";
import {ListVisitorsView} from "./modules/user-managment/visitors/ui/list-visitors.view";
import {ConfigView} from "./modules/config/ui/config.view";
import {useConfig} from "@/app/modules/config/store/config.store";
import {useCurrentStatus} from "@/app/modules/calendar/store/current-status.store";
import {backEvent} from "@/app/modules/calendar/_actions/back-event.action";
import {advanceEvent} from "@/app/modules/calendar/_actions/advance-event.action";
import {setAutoEvent} from "@/app/modules/calendar/_actions/set-auto-event.action";
import {lockVotes} from "@/app/modules/votes/_actions/lock-votes.action";

export const StartupWeekendAdminApp = () => {
    const [activeTab, setActiveTab] = useState('accueil');
    const [currentTime, setCurrentTime] = useState(new Date());
    const {config} = useConfig((state) => state);
    const {status} = useCurrentStatus((state) => state);
    const {currentEvent} = status;
    const [countTeams, setCountTeams] = useState(0);

    // Mettre à jour l'heure actuelle toutes les minutes
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // 60 secondes
        return () => clearInterval(interval);
    }, []);

    // Calcul de la progression du weekend
    const progress = useMemo(() => {
        const startTime = new Date(config.event_start_date ?? '2025-09-05T18:00:00');
        startTime.setHours(18, 0, 0, 0); // Forcer à 18h00
        const endTime = new Date(startTime);
        endTime.setDate(startTime.getDate() + 2);
        endTime.setHours(15, 0, 0, 0); // Dimanche 15h
        const totalDuration = endTime.getTime() - startTime.getTime();
        const elapsed = currentTime.getTime() - startTime.getTime();

        if (elapsed < 0) return 0;
        if (elapsed > totalDuration) return 100;
        return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    }, [currentTime, config]);

    const handleNextEvent = () => {
        try {
            if (currentEvent?.step === 3 && countTeams === 0) {
                alert('Vous devez créer au moins une équipe avant de passer à l\'événement suivant.');
                return;
            }

            if (currentEvent?.step === 3) {
                lockVotes()
            }

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

    const loadCountTeams = async () => {
        try {
            setCountTeams(0);
            const response = await fetch('/api/teams/count');

            if (!response.ok) {
                throw new Error('Erreur lors du chargement');
            }

            const data = await response.json();
            setCountTeams(data);
        } catch (err) {
            console.error(err);
            alert('Erreur lors du chargement des équipes');
        }
    };

    useEffect(() => {
        loadCountTeams();
    }, []);

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
                        <button
                            onClick={() => handleNextEvent()}
                            className={`basis-[100%] flex items-center justify-center gap-2 text-white px-3 py-2 rounded-lg bg-green-600 hover:bg-green-400 transition-colors ${currentEvent?.step === 3 && countTeams === 0 ? 'opacity-50' : ''}`}
                            disabled={currentEvent?.step === 3 && countTeams === 0}
                        >
                            {!currentEvent ? 'Start' : status?.nextCTA ?? 'Next'}
                            <SkipForward className="w-4 h-4"/>
                        </button>
                    </div>

                    {currentEvent?.step > 0 && currentEvent?.step < 4 && (
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
                        {currentEvent?.step === 2 ?
                            <IdeaCreationView/> :
                            currentEvent?.step === 3 ? <VoteResultsView/> :
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
