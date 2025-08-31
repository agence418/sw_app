import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
        
        if (!data.participantId || !data.projectId) {
            return NextResponse.json(
                { error: 'ID participant et ID projet requis' },
                { status: 400 }
            );
        }

        const vote = await db.createVote({
            participantId: parseInt(data.participantId),
            projectId: data.projectId
        });
        
        return NextResponse.json(vote, { status: 201 });
    } catch (error: any) {
        if (error.message && error.message.includes('déjà voté')) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Erreur lors de l\'enregistrement du vote' },
            { status: 500 }
        );
    }
}