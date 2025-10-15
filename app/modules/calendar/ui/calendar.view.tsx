import React from "react";
import { CALENDAR } from "../values/calendar.const";
import { Event } from "../types/event.type";

// Helper to generate calendar organized by day
const generateCalendarByDay = (): Record<string, Event[]> => {
    const calendarByDay: Record<string, Event[]> = {};

    Object.values(CALENDAR).forEach((stage) => {
        stage.steps.forEach((event) => {
            // Use event.day if available, otherwise use stage.day
            const dayLabel = event.day ?? stage.day;

            if (!calendarByDay[dayLabel]) {
                calendarByDay[dayLabel] = [];
            }

            calendarByDay[dayLabel].push(event);
        });
    });

    // Sort events within each day by time
    Object.keys(calendarByDay).forEach((day) => {
        calendarByDay[day].sort((a, b) => {
            const [aHour, aMinute] = a.time.split(':').map(Number);
            const [bHour, bMinute] = b.time.split(':').map(Number);
            return (aHour * 60 + aMinute) - (bHour * 60 + bMinute);
        });
    });

    return calendarByDay;
};

export const CalendarView = () => {
    const calendarByDay = generateCalendarByDay();

    // Define day order for display
    const dayOrder = ['Vendredi soir', 'Samedi', 'Dimanche', 'Dimanche matin', 'Dimanche après-midi', 'Samedi & Dimanche matin', 'Après l\'événement'];
    const sortedDays = Object.keys(calendarByDay).sort((a, b) => {
        const indexA = dayOrder.indexOf(a);
        const indexB = dayOrder.indexOf(b);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });

    return (
        <div className="space-y-4">
            {sortedDays.map((day) => (
                <div key={day} className="bg-white dark:bg-black rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-semibold mb-3 capitalize text-gray-800 dark:text-gray-200">
                        {day}
                    </h3>
                    <div className="space-y-2">
                        {calendarByDay[day].map((event, index) => (
                            <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div className="text-sm font-medium text-blue-500 w-16">
                                    {event.time}
                                </div>
                                <div className="flex-1 text-gray-800 dark:text-gray-200">
                                    {event.title}
                                </div>
                                {event.duration > 0 && (
                                    <div className="text-xs text-gray-500">
                                        {Math.floor(event.duration / 60)}h{event.duration % 60 > 0 ? `${event.duration % 60}m` : ''}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}