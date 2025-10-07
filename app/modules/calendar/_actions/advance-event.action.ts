import {useCurrentStatus} from "@/app/modules/calendar/store/current-status.store";
import {getEventFromID} from "@/app/modules/calendar/helpers/get-event-from-id.action";
import {fetchEvent} from "@/app/modules/calendar/_actions/fetch-event.action";

export const advanceEvent = async () => {
    try {
        const response = await fetch('/api/events/advance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'avancement de l\'événement');
        }

        const {status} = useCurrentStatus.getState();
        useCurrentStatus.setState({
            status: {
                ...status,
                autoAdvance: false,
                currentEvent: getEventFromID(Math.max((status.currentEvent?.step ?? -1) + 1, 1))
            }
        });

        await fetchEvent();
    } catch (error) {
        console.error('Advance event error:', error);
        throw error;
    }
}