import {useCurrentStatus} from "@/app/modules/calendar/store/current-status.store";
import {
    getEventFromStageID,
    getNextEventFromStageID,
    getPreviousEventFromStageID
} from "@/app/modules/calendar/helpers/get-event-from-stage-id.action";
import {useConfig} from "@/app/modules/config/store/config.store";
import {getCTAFromStageID} from "@/app/modules/calendar/helpers/get-cta-from-id.action";

export const fetchEvent = async () => {
    try {
        const response = await fetch('/api/events/advance', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'avancement de l\'événement');
        }

        const data = await response.json();

        const {status} = useCurrentStatus.getState();
        const {config} = useConfig.getState();

        useCurrentStatus.setState({
            status: {
                ...status,
                currentEvent: getEventFromStageID(data.currentStep, config?.event_start_date ?? '2025-09-05T18:00:00'),
                nextEvent: getNextEventFromStageID(data.currentStep, config?.event_start_date ?? '2025-09-05T18:00:00'),
                previousEvent: getPreviousEventFromStageID(data.currentStep, config?.event_start_date ?? '2025-09-05T18:00:00'),
                nextCTA: getCTAFromStageID(data.currentStep)
            }
        });
    } catch (error) {
        console.error('Advance event error:', error);
        throw error;
    }
}