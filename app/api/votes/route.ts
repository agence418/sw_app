import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
    try {
        const votes = await db.getVotes();
        return NextResponse.json(votes);
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des votes' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        if (!data.participantId || !data.ideaName) {
            return NextResponse.json(
                { error: 'ID participant et nom de l\'idée requis' },
                { status: 400 }
            );
        }

        const vote = await db.createVote(data.participantId, data.ideaName);
        return NextResponse.json(vote, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de l\'enregistrement du vote' },
            { status: 500 }
        );
    }
}