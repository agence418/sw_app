'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { CALENDAR } from '../../calendar/values/calendar.const';

interface AdminEventControlsProps {
    currentDay: 'vendredi' | 'dimanche';
}

export const AdminEventControls: React.FC<AdminEventControlsProps> = ({ currentDay }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const todayEvents = CALENDAR[currentDay];
    const currentEvent = todayEvents?.find(e => e.step === currentStep);
    const nextEvent = todayEvents?.find(e => e.step === currentStep + 1);

    useEffect(() => {
        fetchCurrentStep();
    }, [currentDay]);

    const fetchCurrentStep = async () => {
        try {
            const response = await fetch(`/api/events/advance?day=${currentDay}`);
            const data = await response.json();
            if (response.ok) {
                setCurrentStep(data.currentStep);
            }
        } catch (error) {
            console.error('Erreur récupération étape:', error);
        }
    };

    const advanceStep = async () => {
        if (!nextEvent) return;
        
        setLoading(true);
        try {
            const response = await fetch('/api/events/advance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ day: currentDay })
            });
            
            const data = await response.json();
            if (response.ok) {
                setCurrentStep(data.currentStep);
                // Refresh the page to update the UI
                window.location.reload();
            } else {
                alert('Erreur: ' + data.error);
            }
        } catch (error) {
            console.error('Erreur avancement:', error);
            alert('Erreur lors de l\'avancement');
        } finally {
            setLoading(false);
        }
    };

    const resetToStep0 = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/events/advance', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ day: currentDay, step: 0 })
            });
            
            const data = await response.json();
            if (response.ok) {
                setCurrentStep(0);
                window.location.reload();
            } else {
                alert('Erreur: ' + data.error);
            }
        } catch (error) {
            console.error('Erreur reset:', error);
            alert('Erreur lors de la remise à zéro');
        } finally {
            setLoading(false);
        }
    };

    if (!todayEvents) return null;

    return (
        <div className="bg-gray-50 dark:bg-gray-900 border border-green-400 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
                🔧 Contrôles Administrateur - {currentDay.charAt(0).toUpperCase() + currentDay.slice(1)}
            </h3>
            
            <div className="space-y-3">
                <div className="text-sm">
                    <div className="font-medium">Étape actuelle ({currentStep}):</div>
                    <div className="text-blue-700">
                        {currentEvent ? `${currentEvent.time} - ${currentEvent.title}` : 'Aucun événement'}
                    </div>
                </div>

                {nextEvent && (
                    <div className="text-sm">
                        <div className="font-medium">Prochaine étape ({nextEvent.step}):</div>
                        <div className="text-gray-600">
                            {nextEvent.time} - {nextEvent.title}
                        </div>
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={advanceStep}
                        disabled={loading || !nextEvent}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-9000 text-white dark:text-gray-900 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4" />
                        {loading ? 'Avancement...' : 'Passer à l\'étape suivante'}
                    </button>

                    <button
                        onClick={resetToStep0}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white dark:text-gray-900 rounded-lg hover:bg-gray-700 disabled:opacity-50"
                    >
                        <RotateCcw className="w-4 h-4" />
                        {loading ? 'Reset...' : 'Reset à 0'}
                    </button>
                </div>
            </div>
        </div>
    );
};