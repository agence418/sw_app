import {Clock} from "lucide-react";
import React from "react";
import {useCurrentStatus} from "@/app/modules/calendar/store/current-status.store";

export const NowView = () => {
    const {currentEvent, previousEvent, nextEvent} = useCurrentStatus(state => state.status);

    return (
        <div className="space-y-6">
            <div
                className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                <h2 className="text-lg text-gray-800 dark:text-gray-200 font-semibold mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-600"/>
                    Calendrier
                </h2>
                {currentEvent ? (
                    <div className={'space-y-2'}>
                        {/*{nextEvent && (*/}
                        {/*    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2.5 w-3/4">*/}
                        {/*        <div className="text-gray-600 text-xs">Suivant</div>*/}
                        {/*        <div className="text-gray-800 dark:text-gray-200 text-sm">{nextEvent.title}</div>*/}
                        {/*    </div>*/}
                        {/*)}*/}
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 ms-4">
                            <div className="text-gray-600 text-sm">En cours</div>
                            <div className="text-gray-800 dark:text-gray-200 text-lg">{currentEvent.title}</div>
                        </div>
                        {/*{previousEvent && (*/}
                        {/*    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2.5 w-3/4">*/}
                        {/*        <div className="text-gray-600 text-xs">Précédent</div>*/}
                        {/*        <div className="text-gray-800 dark:text-gray-200 text-sm">{previousEvent.title}</div>*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                ) : (
                    <div className="text-gray-500">Aucun événement en cours</div>
                )}
            </div>
        </div>
    )
}