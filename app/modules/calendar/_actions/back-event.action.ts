import {useCurrentStatus} from "@/app/modules/calendar/store/current-status.store";
import {getEventFromStageID} from "@/app/modules/calendar/helpers/get-event-from-stage-id.action";
import {fetchEvent} from "@/app/modules/calendar/_actions/fetch-event.action";
import {useConfig} from "@/app/modules/config/store/config.store";
import {getCTAFromStageID} from "@/app/modules/calendar/helpers/get-cta-from-id.action";

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
                currentEvent: getEventFromStageID((status.currentEvent?.step ?? 0) - 1, config.event_start_date),
                nextEvent: getEventFromStageID((status.currentEvent?.step ?? 0), config.event_start_date),
                previousEvent: getEventFromStageID((status.currentEvent?.step ?? 0) - 2, config.event_start_date),
                nextCTA: getCTAFromStageID((status.currentEvent?.step ?? 0) - 1)
            }
        });

        fetchEvent()
    } catch (error) {
        console.error('Advance event error:', error);
        throw error;
    }
}