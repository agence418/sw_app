import {Clock} from "lucide-react";
import React from "react";
import {getCurrentEvent} from "../_actions/get-current-event.action";

export const NowView = () => {
    const currentEvent = getCurrentEvent();

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                <h2 className="text-lg text-gray-800 dark:text-gray-200 font-semibold mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-600" />
                    Maintenant
                </h2>
                {currentEvent ? (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <div className="text-blue-800 font-medium">{currentEvent.time}</div>
                        <div className="text-blue-900 text-lg">{currentEvent.title}</div>
                    </div>
                ) : (
                    <div className="text-gray-500">Aucun événement en cours</div>
                )}
            </div>
        </div>
    )
}