import { CALENDAR } from '@/app/modules/calendar/values/calendar.const';
import { getCurrentDateTime } from '@/app/modules/calendar/helpers/get-current-datetime.action';

// Helper function to get current day from eventStartDate
export const getCurrentDayOffset = (eventStartDate: string): number => {
  const startDate = new Date(eventStartDate).setHours(0, 0, 0, 0);
  const currentDate = new Date();

  return Math.floor((currentDate.getTime() - startDate) / (1000 * 60 * 60 * 24));
};

export const getEventFromStageID = (id: number, eventStartDate?: string) => {
  const currentTime = getCurrentDateTime();

  const calendarBlock = CALENDAR[id];
  if (!calendarBlock) return;

  if (calendarBlock.steps.length === 1) {
    return calendarBlock.steps[0];
  }

  const currentDayOffset = getCurrentDayOffset(eventStartDate || '2025-09-05T18:00:00');

  const eventsToday = calendarBlock.steps.filter((event) => {
    if (event.day) {
      if (event.day === 'Vendredi' && currentDayOffset === 0) return true;
      if (event.day === 'Samedi' && currentDayOffset === 1) return true;
      if (event.day === 'Dimanche' && currentDayOffset === 2) return true;
      return false;
    }

    return false;
  });

  if (eventsToday.length === 0) return;

  // Find the current or most recent event based on time
  const event = eventsToday
    .sort((a, b) => {
      const [aHour, aMinute] = a.time.split(':').map(Number);
      const [bHour, bMinute] = b.time.split(':').map(Number);
      return aHour * 60 + aMinute - (bHour * 60 + bMinute);
    })
    .filter((event) => {
      const [eventHour, eventMinute] = event.time.split(':').map(Number);
      const [currentHour, currentMinute] = currentTime.split(':').map(Number);
      return eventHour < currentHour || (eventHour === currentHour && eventMinute <= currentMinute);
    })
    .pop(); // Get the last (most recent) event

  // If no event has started yet, return the first event of the day
  return event || eventsToday[0];
};

export const getNextEventFromStageID = (id: number, eventStartDate?: string) => {
  const calendarBlock = CALENDAR[id];
  if (!calendarBlock) return;

  // Si un seul step dans le stage, passer au stage suivant
  if (calendarBlock.steps.length === 1) {
    const nextBlock = CALENDAR[id + 1];
    if (!nextBlock) return calendarBlock.steps[0];
    return nextBlock.steps[0];
  }

  // Plusieurs steps dans le stage
  const currentDayOffset = getCurrentDayOffset(eventStartDate || '2025-09-05T18:00:00');
  const currentEvent = getEventFromStageID(id, eventStartDate);
  if (!currentEvent) return calendarBlock.steps[0];

  // Filtrer les événements du même jour
  const eventsToday = calendarBlock.steps.filter((event) => {
    if (event.day) {
      if (event.day === 'Vendredi' && currentDayOffset === 0) return true;
      if (event.day === 'Samedi' && currentDayOffset === 1) return true;
      if (event.day === 'Dimanche' && currentDayOffset === 2) return true;
    }
    return false;
  });

  // Trier par temps
  const sortedEvents = eventsToday.sort((a, b) => {
    const [aHour, aMinute] = a.time.split(':').map(Number);
    const [bHour, bMinute] = b.time.split(':').map(Number);
    return aHour * 60 + aMinute - (bHour * 60 + bMinute);
  });

  // Trouver l'index de l'événement actuel
  const currentIndex = sortedEvents.findIndex(
    (e) => e.time === currentEvent.time && e.title === currentEvent.title
  );

  // S'il y a un événement suivant dans le même stage
  if (currentIndex >= 0 && currentIndex < sortedEvents.length - 1) {
    return sortedEvents[currentIndex + 1];
  }

  // Sinon, passer au stage suivant
  const nextBlock = CALENDAR[id + 1];
  if (!nextBlock) return currentEvent;
  return nextBlock.steps[0];
};

export const getPreviousEventFromStageID = (id: number, eventStartDate?: string) => {
  const calendarBlock = CALENDAR[id];
  if (!calendarBlock) return;

  // Si un seul step dans le stage, passer au stage précédent
  if (calendarBlock.steps.length === 1) {
    if (id === 1) return undefined;
    const previousBlock = CALENDAR[id - 1];
    if (!previousBlock) return undefined;
    // Retourner le dernier événement du stage précédent
    return previousBlock.steps[previousBlock.steps.length - 1];
  }

  // Plusieurs steps dans le stage
  const currentDayOffset = getCurrentDayOffset(eventStartDate || '2025-09-05T18:00:00');
  const currentEvent = getEventFromStageID(id, eventStartDate);
  if (!currentEvent) return undefined;

  // Filtrer les événements du même jour
  const eventsToday = calendarBlock.steps.filter((event) => {
    if (event.day) {
      if (event.day === 'Vendredi' && currentDayOffset === 0) return true;
      if (event.day === 'Samedi' && currentDayOffset === 1) return true;
      if (event.day === 'Dimanche' && currentDayOffset === 2) return true;
    }
    return false;
  });

  // Trier par temps
  const sortedEvents = eventsToday.sort((a, b) => {
    const [aHour, aMinute] = a.time.split(':').map(Number);
    const [bHour, bMinute] = b.time.split(':').map(Number);
    return aHour * 60 + aMinute - (bHour * 60 + bMinute);
  });

  // Trouver l'index de l'événement actuel
  const currentIndex = sortedEvents.findIndex(
    (e) => e.time === currentEvent.time && e.title === currentEvent.title
  );

  // S'il y a un événement précédent dans le même stage
  if (currentIndex > 0) {
    return sortedEvents[currentIndex - 1];
  }

  // Sinon, passer au stage précédent
  if (id === 1) return undefined;
  const previousBlock = CALENDAR[id - 1];
  if (!previousBlock) return undefined;
  // Retourner le dernier événement du stage précédent
  return previousBlock.steps[previousBlock.steps.length - 1];
};
