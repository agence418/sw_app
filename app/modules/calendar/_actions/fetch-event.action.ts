import {useCurrentStatus} from "@/app/modules/calendar/store/current-status.store";
import {getEventFromID} from "@/app/modules/calendar/helpers/get-event-from-id.action";
import {useConfig} from "@/app/modules/config/store/config.store";

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
                currentEvent: getEventFromID(data.currentStep, config?.event_start_date ?? '2025-09-05T18:00:00'),
                nextEvent: getEventFromID(data.currentStep + 1, config?.event_start_date ?? '2025-09-05T18:00:00'),
                previousEvent: getEventFromID(data.currentStep - 1, config?.event_start_date ?? '2025-09-05T18:00:00')
            }
        });
    } catch (error) {
        console.error('Advance event error:', error);
        throw error;
    }
}