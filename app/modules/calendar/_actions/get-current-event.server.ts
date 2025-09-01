import {CALENDAR} from "../values/calendar.const";
import {db} from "@/lib/db";

// Version serveur uniquement - ne jamais importer côté client !
export const getCurrentEventServer = async () => {
    const currentTime = new Date();
    const currentDay = currentTime.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
    const currentTimeStr = currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const todayEvents = CALENDAR[currentDay as keyof typeof CALENDAR];
    if (!todayEvents) return null;

    // Pour vendredi et dimanche, utiliser l'index depuis la base de données
    if (currentDay === 'vendredi' || currentDay === 'dimanche') {
        try {
            const currentStep = await db.getCurrentEventState(currentDay as 'vendredi' | 'dimanche');
            const event = todayEvents.find(e => e.step === currentStep);
            return event || null;
        } catch (error) {
            console.error('Erreur récupération état événement:', error);
            // Fallback sur le système basé sur l'heure
        }
    }

    // Pour samedi ou en cas d'erreur, utiliser le système basé sur l'heure
    for (let i = 0; i < todayEvents.length; i++) {
        const event = todayEvents[i];
        const nextEvent = todayEvents[i + 1];

        if (currentTimeStr >= event.time && (!nextEvent || currentTimeStr < nextEvent.time)) {
            return event;
        }
    }
    return null;
};