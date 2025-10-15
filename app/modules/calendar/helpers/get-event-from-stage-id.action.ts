import {CALENDAR} from "@/app/modules/calendar/values/calendar.const";
import {getCurrentDateTime} from "@/app/modules/calendar/helpers/get-current-datetime.action";

// Helper function to get the event stage based on start date and current date
const getEventStage = (eventStartDate: string): number => {
    const startDate = new Date(eventStartDate);
    const currentDate = new Date();

    // Calculate days from start
    const daysDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // Map days to stages
    if (daysDiff < 0) return 1; // Before event start
    if (daysDiff === 0) return Math.min(4, 1); // Day 0 (Friday): stages 1-4
    if (daysDiff === 1) return 5; // Day 1 (Saturday): stage 5
    if (daysDiff === 2) return 6; // Day 2 (Sunday): stages 6-7
    return 7; // After event
};

export const getEventFromStageID = (id: number, eventStartDate?: string) => {
    if (id < 0) {
        // set to auto, we should return event depending on date and time
        const currentTime = getCurrentDateTime();
        const stage = getEventStage(eventStartDate || '2025-09-05T18:00:00');

        const calendarBlock = CALENDAR[stage];
        if (!calendarBlock) return;

        const eventsToday = calendarBlock.steps;
        if (!eventsToday) return;

        // Find the latest event that is before or at the current time
        const event = eventsToday
            .sort((a, b) => {
                const [aHour, aMinute] = a.time.split(':').map(Number);
                const [bHour, bMinute] = b.time.split(':').map(Number);
                return (bHour - aHour) || (bMinute - aMinute);
            })
            .filter(event => {
                const [eventHour, eventMinute] = event.time.split(':').map(Number);
                const [currentHour, currentMinute] = currentTime.split(':').map(Number);
                return (eventHour < currentHour) || (eventHour === currentHour && eventMinute <= currentMinute);
            })[0];

        console.log({eventsToday, stage})
        if (!event) return eventsToday[eventsToday.length - 1];

        return event;
    }

    // Find event by step ID across all calendar blocks
    const allEvents = Object.values(CALENDAR).flatMap(block => block.steps);
    return allEvents.find(event => event.step == id);
}