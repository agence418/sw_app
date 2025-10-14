import {useCurrentStatus} from "@/app/modules/calendar/store/current-status.store";
import {getEventFromID} from "@/app/modules/calendar/helpers/get-event-from-id.action";
import {fetchEvent} from "@/app/modules/calendar/_actions/fetch-event.action";
import {useConfig} from "@/app/modules/config/store/config.store";

export const backEvent = async () => {
    try {
        const response = await fetch('/api/events/back', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'avancement de l\'événement');
        }


        const {status} = useCurrentStatus.getState();
        const {config} = useConfig.getState();
        useCurrentStatus.setState({
            status: {
                ...status,
                autoAdvance: false,
                currentEvent: getEventFromID((status.currentEvent?.step ?? 0) - 1, config.event_start_date),
                nextEvent: getEventFromID((status.currentEvent?.step ?? 0), config.event_start_date),
                previousEvent: getEventFromID((status.currentEvent?.step ?? 0) - 2, config.event_start_date)
            }
        });

        fetchEvent()
    } catch (error) {
        console.error('Advance event error:', error);
        throw error;
    }
}