import {CALENDAR} from "@/app/modules/calendar/values/calendar.const";
import {getCurrentDateTime} from "@/app/modules/calendar/helpers/get-current-datetime.action";

// Helper function to get the event stage based on start date and current date
const getEventStage = (eventStartDate: string): number => {
    const startDate = new Date(eventStartDate);
    const currentDate = new Date();

    // Calculate days from start
    const daysDiff = Math.floor((currentDate.getDate() - startDate.getDate()) / (1000 * 60 * 60 * 24));

    // Map days to stages
    if (daysDiff < 0) return 1; // Before event start
    if (daysDiff === 0) return 4; // Day 0 (Friday): stage 4 (contains Friday events)
    if (daysDiff === 1) return 4; // Day 1 (Saturday): stage 4 (contains Saturday events)
    if (daysDiff === 2) return 6; // Day 2 (Sunday): stage 6
    return 7; // After event
};

// Helper function to get current day from eventStartDate
const getCurrentDayOffset = (eventStartDate: string): number => {
    const startDate = new Date(eventStartDate).setHours(0, 0, 0, 0);
    const currentDate = new Date();

    return Math.floor((currentDate.getTime() - startDate) / (1000 * 60 * 60 * 24));
};

export const getEventFromStageID = (id: number, eventStartDate?: string) => {
    const currentTime = getCurrentDateTime();

    const calendarBlock = CALENDAR[id];
    if (!calendarBlock) return;

    if (calendarBlock.steps.length === 1) {
        return calendarBlock.steps[0];
    }

    const currentDayOffset = getCurrentDayOffset(eventStartDate || '2025-09-05T18:00:00');

    // Filter events for the current day based on dayOffset
    const eventsToday = calendarBlock.steps.filter(event => {
        // If event has a specific day property, use it
        if (event.day) {
            if (event.day === 'Vendredi' && currentDayOffset === 0) return true;
            if (event.day === 'Samedi' && currentDayOffset === 1) return true;
            if (event.day === 'Dimanche' && currentDayOffset === 2) return true;
            return false;
        }

        return false;
    });

    if (eventsToday.length === 0) return;

    // Find the current or most recent event based on time
    const event = eventsToday
        .sort((a, b) => {
            const [aHour, aMinute] = a.time.split(':').map(Number);
            const [bHour, bMinute] = b.time.split(':').map(Number);
            return (aHour * 60 + aMinute) - (bHour * 60 + bMinute);
        })
        .filter(event => {
            const [eventHour, eventMinute] = event.time.split(':').map(Number);
            const [currentHour, currentMinute] = currentTime.split(':').map(Number);
            return (eventHour < currentHour) || (eventHour === currentHour && eventMinute <= currentMinute);
        })
        .pop(); // Get the last (most recent) event


    // If no event has started yet, return the first event of the day
    return event || eventsToday[0];
};

export const getNextEventFromStageID = (id: number, eventStartDate?: string) => {
    const currentTime = getCurrentDateTime();

    const calendarBlock = CALENDAR[id];
    if (!calendarBlock) return;

    if (calendarBlock.steps.length === 1) {
        if (!CALENDAR[id + 1]) {
            return calendarBlock.steps[0];
        }
        const nextBlock = CALENDAR[id + 1];
        return nextBlock.steps[0];
    }

    const currentDayOffset = getCurrentDayOffset(eventStartDate || '2025-09-05T18:00:00');


}

export const getPreviousEventFromStageID = (id: number, eventStartDate?: string) => {
    const currentTime = getCurrentDateTime();

    const calendarBlock = CALENDAR[id];
    if (!calendarBlock) return;

    if (calendarBlock.steps.length === 1) {
        if (id === 1) {
            return;
        }
        const nextBlock = CALENDAR[id - 1];
        return nextBlock.steps[0];
    }

    const currentDayOffset = getCurrentDayOffset(eventStartDate || '2025-09-05T18:00:00');

}