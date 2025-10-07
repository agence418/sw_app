import {CALENDAR} from "@/app/modules/calendar/values/calendar.const";
import {getCurrentDay} from "@/app/modules/calendar/helpers/get-current-day.action";
import {getCurrentDateTime} from "@/app/modules/calendar/helpers/get-current-datetime.action";

export const getEventFromID = (id: number) => {
    if (id < 0) {
        // set to auto, we should return event depending on date and time

        const currentDay = getCurrentDay();
        const currentTime = getCurrentDateTime();

        const eventsToday = CALENDAR[currentDay] || CALENDAR.samedi;
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

        console.log({eventsToday})
        if (!event) return eventsToday[eventsToday.length - 1];

        return event;

    }

    const events = Object.values(CALENDAR).flatMap(day => day);
    return events.find(event => event.step == id);
}