import {useCurrentStatus} from "@/app/modules/calendar/store/current-status.store";
import {getEventFromID} from "@/app/modules/calendar/helpers/get-event-from-id.action";

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
        useCurrentStatus.setState({
            status: {
                ...status,
                currentEvent: getEventFromID(data.currentStep),
                nextEvent: getEventFromID(data.currentStep + 1),
                previousEvent: getEventFromID(data.currentStep - 1)
            }
        });
    } catch (error) {
        console.error('Advance event error:', error);
        throw error;
    }
}