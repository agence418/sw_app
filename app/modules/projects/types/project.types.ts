export interface Project {
    id: string;
    name: string;
    description: string;
    participantId: string;
    participantName: string;
    createdAt: Date;
}

export interface CreateProjectDTO {
    name: string;
    description: string;
    participantId: string;
    participantName: string;
}