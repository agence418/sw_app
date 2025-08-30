import {CALENDAR} from "../values/calendar.const";

export const getCurrentEvent = () => {
    const currentTime = new Date();
    const currentDay = currentTime.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
    const currentTimeStr = currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const todayEvents = CALENDAR[currentDay as keyof typeof CALENDAR];
    if (!todayEvents) return null;

    for (let i = 0; i < todayEvents.length; i++) {
        const event = todayEvents[i];
        const nextEvent = todayEvents[i + 1];

        if (currentTimeStr >= event.time && (!nextEvent || currentTimeStr < nextEvent.time)) {
            return event;
        }
    }
    return null;
};