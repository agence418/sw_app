export type Event = {
    step: number;
    title: string;
    time: string;
    duration: number;
    day?: string; // Optional: overrides the stage's day
    nextCTA?: string;
};

export type Stage = {
    day: string;
    dayOffset: number;
    steps: Event[];
    cta: string;
};

export type Calendar = Record<number, Stage>;