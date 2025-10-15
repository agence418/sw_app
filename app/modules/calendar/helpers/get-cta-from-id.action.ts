import {CALENDAR} from "@/app/modules/calendar/values/calendar.const";

export const getCTAFromStageID = (id: number) => {
    if (id < 0) {
        return 'Start'
    }

    const stage = CALENDAR[id];

    if (stage) {
        return stage.cta ?? 'Suivant';
    }

    return 'Suivant'
}