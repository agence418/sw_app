import {useCurrentStatus} from "@/app/modules/calendar/store/current-status.store";
import {getEventFromID} from "@/app/modules/calendar/helpers/get-event-from-id.action";
import {fetchEvent} from "@/app/modules/calendar/_actions/fetch-event.action";

export const setAutoEvent = async () => {
    try {
        const response = await fetch('/api/events/advance', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({step: -1})
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'avancement de l\'événement');
        }

        const {status} = useCurrentStatus.getState();
        useCurrentStatus.setState({
            status: {
                ...status,
                autoAdvance: true,
                currentEvent: getEventFromID((status.currentEvent?.step ?? 0) - 1)
            }
        });

        fetchEvent()
    } catch (error) {
        console.error('Advance event error:', error);
        throw error;
    }
}