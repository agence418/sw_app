export type Event = {
    step: number;
    title: string;
    time: string;
    day?: 'Vendredi' | 'Samedi' | 'Dimanche'; // Optional: overrides the stage's day
};

export type Stage = {
    day: 'Vendredi' | 'Samedi' | 'Dimanche';
    steps: Event[];
    cta: string;
};

export type Calendar = Record<number, Stage>;