import React from "react";
import { CALENDAR } from "../values/calendar.const";

export const CalendarView = () => {
    return (
        <div className="space-y-4">
            {Object.entries(CALENDAR).map(([day, events]) => (
                <div key={day} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-3 capitalize text-gray-800">
                        {day}
                    </h3>
                    <div className="space-y-2">
                        {events.map((event, index) => (
                            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm font-medium text-blue-600 w-16">
                                    {event.time}
                                </div>
                                <div className="flex-1 text-gray-800">
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