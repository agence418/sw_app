export interface Idea {
    id: string;
    name: string;
    description?: string;
    participantId: string;
    participantName?: string;
    createdAt?: Date;
}

export interface CreateIdeaDTO {
    name: string;
    description?: string;
    participantId: string;
    participantName?: string;
}
